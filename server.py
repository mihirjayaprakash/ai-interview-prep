import http.server
import json
import io
import traceback
import os
import urllib.parse
import multiprocessing
from contextlib import redirect_stdout, redirect_stderr

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TIMEOUT = 3  # seconds
MAX_OUTPUT = 5000  # characters
API_KEY = os.environ.get("API_KEY", "")  # optional protection


# 🔒 VERY restricted builtins
SAFE_BUILTINS = {
    "print": print,
    "range": range,
    "len": len,
    "int": int,
    "float": float,
    "str": str,
    "bool": bool,
    "list": list,
    "dict": dict,
    "set": set,
    "tuple": tuple,
    "enumerate": enumerate,
    "sum": sum,
    "min": min,
    "max": max,
    "abs": abs,
}


def execute_code(code, queue):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    result = {"output": "", "error": "", "success": True}

    try:
        exec_globals = {"__builtins__": SAFE_BUILTINS}

        with redirect_stdout(stdout_buf), redirect_stderr(stderr_buf):
            exec(compile(code, "<stdin>", "exec"), exec_globals)

        result["output"] = stdout_buf.getvalue()[:MAX_OUTPUT]
        result["error"] = stderr_buf.getvalue()[:MAX_OUTPUT]

    except Exception:
        result["success"] = False
        result["error"] = traceback.format_exc()[:MAX_OUTPUT]
        result["output"] = stdout_buf.getvalue()[:MAX_OUTPUT]

    queue.put(result)


def run_python_code(code):
    queue = multiprocessing.Queue()
    process = multiprocessing.Process(target=execute_code, args=(code, queue))

    process.start()
    process.join(TIMEOUT)

    if process.is_alive():
        process.terminate()
        return {
            "output": "",
            "error": "Execution timed out",
            "success": False,
        }

    if not queue.empty():
        return queue.get()

    return {
        "output": "",
        "error": "Unknown error",
        "success": False,
    }


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/index.html":
            self.serve_file(os.path.join(BASE_DIR, "index.html"), "text/html")

        elif path.startswith("/static/"):
            file_path = os.path.join(BASE_DIR, path.lstrip("/"))
            if os.path.exists(file_path):
                ext = os.path.splitext(file_path)[1]
                mime = {
                    ".css": "text/css",
                    ".js": "application/javascript"
                }.get(ext, "text/plain")
                self.serve_file(file_path, mime)
            else:
                self.send_error(404)
        else:
            self.send_error(404)

    def do_POST(self):
        if self.path == "/run":

            # 🔒 Optional API key protection
            if API_KEY:
                if self.headers.get("Authorization") != API_KEY:
                    self.send_response(403)
                    self.end_headers()
                    return

            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)

            try:
                data = json.loads(body)
                code = data.get("code", "")
            except:
                self.send_error(400)
                return

            result = run_python_code(code)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def serve_file(self, path, mime):
        try:
            with open(path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", len(content))
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404)


if __name__ == "__main__":
    import multiprocessing

    try:
        multiprocessing.set_start_method("fork")
    except RuntimeError:
        pass

    PORT = int(os.environ.get("PORT", 3000))
    print(f"Running on port {PORT}")

    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler) as httpd:
        httpd.serve_forever()