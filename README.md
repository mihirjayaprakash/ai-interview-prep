# AI Engineer Interview Prep

A self-contained learning app with lessons, quizzes, and a live Python compiler.

## Setup

No dependencies needed — just Python 3.

```bash
cd ai-interview-prep
python server.py
```

Then open: http://localhost:3000

## What's inside

- **Python & DSA** — Lists/dicts, hashmaps, two pointers, sliding window, stack/queue, clean Python
- **LLM Fundamentals** — Transformers, attention, tokenization, prompt engineering
- **RAG & Agents** — RAG pipeline, chunking, vector search, agents
- **System Design** — AI system design, real-time pipelines, trade-offs

## Features

- Live Python code editor (Monaco — same as VS Code)
- Run code directly in the browser, output shown instantly
- Quizzes with explanations
- "Try in editor" button on every code example
- Dark/light theme
- Progress saved in localStorage

## Structure

```
ai-interview-prep/
├── server.py          # Python HTTP server + /run endpoint
├── index.html         # App shell
└── static/
    ├── css/style.css  # All styles
    └── js/
        ├── data.js    # All curriculum content
        └── app.js     # App logic
```

## Adding content

Edit `static/js/data.js` to add new lessons, concepts, or quiz questions.
Each lesson follows this schema:

```js
{
  id: "lesson-id",
  title: "Lesson Title",
  tag: "must know",
  summary: "One line description",
  concepts: [
    {
      title: "Concept name",
      body: "Explanation text",
      code: "# Python code here"
    }
  ],
  quiz: [
    {
      q: "Question?",
      options: ["A", "B", "C", "D"],
      answer: 0,  // index of correct option
      explain: "Why this is correct"
    }
  ],
  starter: "# Starter code for the editor"
}
```
