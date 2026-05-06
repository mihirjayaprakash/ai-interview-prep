// ── State ──────────────────────────────────────────────────────────────────
const state = {
  currentPillar: 0,
  currentLesson: 0,
  currentSection: 'learn', // 'learn' | 'quiz' | 'code'
  quizAnswers: {},
  completedLessons: JSON.parse(localStorage.getItem('completed') || '[]'),
  editorCode: {},
};

// ── Init ───────────────────────────────────────────────────────────────────
let editor = null;

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  loadLesson(0, 0);
  initEditor();
});

// ── Editor ─────────────────────────────────────────────────────────────────
function initEditor() {
  require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
  require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('monaco-container'), {
      value: '# Write Python here\nprint("Hello, AI engineer!")',
      language: 'python',
      theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'vs',
      fontSize: 13,
      minimap: { enabled: false },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: { top: 12, bottom: 12 },
    });

    document.getElementById('run-btn').addEventListener('click', runCode);
    document.getElementById('reset-btn').addEventListener('click', resetCode);
    document.getElementById('copy-btn').addEventListener('click', copyCode);
  });
}

async function runCode() {
  const code = editor.getValue();
  const btn = document.getElementById('run-btn');
  const output = document.getElementById('output');

  btn.textContent = 'Running...';
  btn.disabled = true;
  output.className = 'output-box';
  output.textContent = '';

  try {
    const res = await fetch('/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();

    if (data.success) {
      output.className = 'output-box output-success';
      output.textContent = data.output || '(no output)';
      if (data.error) output.textContent += '\n' + data.error;
    } else {
      output.className = 'output-box output-error';
      output.textContent = data.error || 'Unknown error';
      if (data.output) output.textContent = data.output + '\n' + data.error;
    }
  } catch (e) {
    output.className = 'output-box output-error';
    output.textContent = 'Server error: ' + e.message;
  }

  btn.textContent = '▶ Run';
  btn.disabled = false;
}

function resetCode() {
  const p = CURRICULUM.pillars[state.currentPillar];
  const l = p.lessons[state.currentLesson];
  if (editor && l.starter) editor.setValue(l.starter);
}

function copyCode() {
  if (editor) {
    navigator.clipboard.writeText(editor.getValue());
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  }
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';

  CURRICULUM.pillars.forEach((pillar, pi) => {
    const section = document.createElement('div');
    section.className = 'sidebar-section';

    const header = document.createElement('div');
    header.className = 'sidebar-pillar';
    header.innerHTML = `<span class="sidebar-icon" style="color:${pillar.color}">${pillar.icon}</span><span>${pillar.title}</span>`;
    section.appendChild(header);

    pillar.lessons.forEach((lesson, li) => {
      const item = document.createElement('div');
      item.className = 'sidebar-lesson' + (state.completedLessons.includes(`${pi}-${li}`) ? ' completed' : '');
      item.id = `nav-${pi}-${li}`;
      item.textContent = lesson.title;
      item.onclick = () => loadLesson(pi, li);
      section.appendChild(item);
    });

    nav.appendChild(section);
  });
}

function setActiveNav(pi, li) {
  document.querySelectorAll('.sidebar-lesson').forEach(el => el.classList.remove('active'));
  const el = document.getElementById(`nav-${pi}-${li}`);
  if (el) el.classList.add('active');
}

// ── Lesson loader ──────────────────────────────────────────────────────────
function loadLesson(pi, li) {
  state.currentPillar = pi;
  state.currentLesson = li;
  state.currentSection = 'learn';
  state.quizAnswers = {};

  const pillar = CURRICULUM.pillars[pi];
  const lesson = pillar.lessons[li];

  setActiveNav(pi, li);
  updateBreadcrumb(pillar, lesson);
  renderLearn(lesson, pillar.color);
  switchTab('learn');

  // Set editor to starter code
  if (editor && lesson.starter) editor.setValue(lesson.starter);
  else if (editor) editor.setValue('# Write Python here\nprint("Hello!")');

  document.getElementById('output').textContent = '';
  document.getElementById('output').className = 'output-box';

  // Update nav arrows
  updateNavArrows(pi, li);
}

function updateBreadcrumb(pillar, lesson) {
  document.getElementById('breadcrumb').innerHTML =
    `<span style="color:${pillar.color}">${pillar.icon} ${pillar.title}</span> <span class="bc-sep">›</span> ${lesson.title}`;
  document.getElementById('lesson-tag').textContent = lesson.tag;
  document.getElementById('lesson-tag').style.background = pillar.color + '22';
  document.getElementById('lesson-tag').style.color = pillar.color;
}

function updateNavArrows(pi, li) {
  const allLessons = [];
  CURRICULUM.pillars.forEach((p, pIdx) => {
    p.lessons.forEach((l, lIdx) => allLessons.push([pIdx, lIdx]));
  });
  const curr = allLessons.findIndex(([p, l]) => p === pi && l === li);

  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');

  if (curr > 0) {
    prev.disabled = false;
    prev.onclick = () => loadLesson(...allLessons[curr - 1]);
  } else {
    prev.disabled = true;
  }

  if (curr < allLessons.length - 1) {
    next.disabled = false;
    next.onclick = () => loadLesson(...allLessons[curr + 1]);
  } else {
    next.disabled = true;
  }
}

// ── Tabs ───────────────────────────────────────────────────────────────────
function switchTab(tab) {
  state.currentSection = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
}

window.switchTab = switchTab;

// ── Learn panel ────────────────────────────────────────────────────────────
function renderLearn(lesson, color) {
  const el = document.getElementById('panel-learn');
  el.innerHTML = `<p class="lesson-summary">${lesson.summary}</p>`;

  lesson.concepts.forEach((concept, ci) => {
    const card = document.createElement('div');
    card.className = 'concept-card';
    card.innerHTML = `
      <div class="concept-header" onclick="toggleConcept(this)">
        <div class="concept-num" style="background:${color}22;color:${color}">${ci + 1}</div>
        <span class="concept-title">${concept.title}</span>
        <span class="concept-arrow">›</span>
      </div>
      <div class="concept-body">
        <div class="concept-body-inner">
          <p class="concept-explain">${concept.body}</p>
          <div class="code-preview">
            <div class="code-header">
              <span class="code-lang">python</span>
              <button class="code-try-btn" onclick="tryInEditor(\`${escapeTemplate(concept.code)}\`)">Try in editor ↗</button>
            </div>
            <pre class="code-content">${escapeHtml(concept.code)}</pre>
          </div>
        </div>
      </div>
    `;
    el.appendChild(card);
  });
}

function toggleConcept(header) {
  const card = header.closest('.concept-card');
  card.classList.toggle('open');
}

window.toggleConcept = toggleConcept;

function tryInEditor(code) {
  if (editor) {
    editor.setValue(code);
    switchTab('code');
  }
}
window.tryInEditor = tryInEditor;

// ── Quiz panel ─────────────────────────────────────────────────────────────
function renderQuiz() {
  const lesson = CURRICULUM.pillars[state.currentPillar].lessons[state.currentLesson];
  const el = document.getElementById('panel-quiz');
  el.innerHTML = '';
  state.quizAnswers = {};

  if (!lesson.quiz || lesson.quiz.length === 0) {
    el.innerHTML = '<p style="color:var(--muted)">No quiz for this lesson yet.</p>';
    return;
  }

  lesson.quiz.forEach((q, qi) => {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.id = `quiz-${qi}`;
    card.innerHTML = `
      <div class="quiz-num">Q${qi + 1}</div>
      <p class="quiz-q">${q.q}</p>
      <div class="quiz-opts">
        ${q.options.map((opt, oi) => `
          <button class="quiz-opt" onclick="answerQuiz(${qi}, ${oi})" id="opt-${qi}-${oi}">
            <span class="opt-letter">${'ABCD'[oi]}</span> ${opt}
          </button>
        `).join('')}
      </div>
      <div class="quiz-explain" id="explain-${qi}">${q.explain}</div>
    `;
    el.appendChild(card);
  });

  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = 'Mark lesson complete ✓';
  completeBtn.onclick = markComplete;
  el.appendChild(completeBtn);
}

function answerQuiz(qi, oi) {
  if (state.quizAnswers[qi] !== undefined) return;
  state.quizAnswers[qi] = oi;

  const lesson = CURRICULUM.pillars[state.currentPillar].lessons[state.currentLesson];
  const correct = lesson.quiz[qi].answer;
  const isCorrect = oi === correct;

  document.querySelectorAll(`#quiz-${qi} .quiz-opt`).forEach(b => b.disabled = true);
  document.getElementById(`opt-${qi}-${oi}`).classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) document.getElementById(`opt-${qi}-${correct}`).classList.add('correct');

  document.getElementById(`explain-${qi}`).classList.add('visible');
}

window.answerQuiz = answerQuiz;

function markComplete() {
  const key = `${state.currentPillar}-${state.currentLesson}`;
  if (!state.completedLessons.includes(key)) {
    state.completedLessons.push(key);
    localStorage.setItem('completed', JSON.stringify(state.completedLessons));
    buildSidebar();
    setActiveNav(state.currentPillar, state.currentLesson);
  }
  showCompleteBanner();
}

function showCompleteBanner() {
  const banner = document.getElementById('complete-banner');
  banner.classList.add('visible');
  setTimeout(() => banner.classList.remove('visible'), 3000);
}

// ── Tab switching with lazy render ─────────────────────────────────────────
const origSwitchTab = switchTab;
window.switchTab = function(tab) {
  origSwitchTab(tab);
  if (tab === 'quiz') renderQuiz();
};

// ── Theme ──────────────────────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  if (editor) {
    monaco.editor.setTheme(isDark ? 'vs' : 'vs-dark');
  }
  document.getElementById('theme-btn').textContent = isDark ? '☽' : '☀';
}
window.toggleTheme = toggleTheme;

// Apply saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ── Helpers ────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escapeTemplate(str) {
  return str.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$/g,'\\$');
}

window.loadLesson = loadLesson;
