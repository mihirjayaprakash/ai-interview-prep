import http.server
import json
import sys
import io
import traceback
import os
import urllib.parse
from contextlib import redirect_stdout, redirect_stderr

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def run_python_code(code):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    result = {"output": "", "error": "", "success": True}
    try:
        exec_globals = {}
        with redirect_stdout(stdout_buf), redirect_stderr(stderr_buf):
            exec(compile(code, "<stdin>", "exec"), exec_globals)
        result["output"] = stdout_buf.getvalue()
        result["error"] = stderr_buf.getvalue()
    except Exception:
        result["success"] = False
        result["error"] = traceback.format_exc()
        result["output"] = stdout_buf.getvalue()
    return result

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
                mime = {"css": "text/css", "js": "application/javascript"}.get(ext.lstrip("."), "text/plain")
                self.serve_file(file_path, mime)
            else:
                self.send_error(404)
        else:
            self.send_error(404)

    def do_POST(self):
        if self.path == "/run":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            data = json.loads(body)
            result = run_python_code(data.get("code", ""))
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
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
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
    print(f"\n  AI Interview Prep running at http://localhost:{PORT}\n")
    with http.server.HTTPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
