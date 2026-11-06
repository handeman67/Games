// conQuiz — lightweight version. Vanilla JavaScript only, no libraries,
// no external requests. Same look and behavior as the Material UI version,
// same 10 tests, same +5 / -1 scoring, one score per question.

// Same 10 tests: the 9 that were in the app, plus the KB-2.
const QUIZ_SETS = [
  { path: "J_son/c0.json", label: "Carpentry / IBC" },
  { path: "J_son/c1.json", label: "Carpentry (30 questions)" },
  { path: "J_son/c2.json", label: "Carpentry basics" },
  { path: "J_son/c3.json", label: "IBC" },
  { path: "J_son/s0.json", label: "Stairs" },
  { path: "J_son/s1.json", label: "Stairs 2" },
  { path: "J_son/s2.json", label: "Stairs 3" },
  { path: "J_son/s3.json", label: "Stairs / IBC" },
  { path: "J_son/s4.json", label: "Stairs / Arizona" },
  { path: "J_son/kb2.json", label: "Arizona KB-2 (30 questions)" },
];
const LETTERS = ["A", "B", "C", "D", "E"];

// Accepts both JSON shapes:
//   old: { question, answers: [...5], correctAnswer: "text" }  (c1 uses a number)
//   KB-2: { question, choices: [...5], answerIndex: 1 }
function normalizeQuestion(raw) {
  const answers = (raw.answers || raw.choices || []).slice(0, 5);
  let correct = raw.correctAnswer;
  if (typeof correct === "number") correct = answers[correct];
  if (typeof raw.answerIndex === "number") correct = answers[raw.answerIndex];
  if (typeof correct === "string" && !answers.includes(correct)) {
    const found = correct.split(/\s+or\s+/).find((p) => answers.includes(p));
    if (found) correct = found;
  }
  return {
    question: raw.question,
    answers,
    correctAnswer: correct,
    category: raw.category || "",
    explanation: raw.explanation || "",
    reference: raw.reference || "",
  };
}

const $ = (id) => document.getElementById(id);
let testPath = QUIZ_SETS[0].path;
let questions = [];
let current = 0;
let picked = {}; // question index -> answer index
let score = 0;

// --- Memory: your spot is saved in this browser (localStorage), per test,
// so closing the page and coming back picks up where you left off. Scores
// to beat are saved the same way, also per test, on this device only.
const PROGRESS_KEY = "conquiz-progress-v1";
const BEST_KEY = "conquiz-best-v1";
function readStore(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; }
  catch (e) { return {}; }
}
function writeStore(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { /* private mode */ }
}
function saveProgress() {
  const all = readStore(PROGRESS_KEY);
  all[testPath] = { current, picked, score, savedAt: Date.now() };
  all._lastTest = testPath;
  writeStore(PROGRESS_KEY, all);
}
function savedProgressFor(path) {
  const s = readStore(PROGRESS_KEY)[path];
  if (!s || typeof s !== "object") return null;
  if (typeof s.score !== "number" || typeof s.current !== "number") return null;
  return s;
}
function clearProgressFor(path) {
  const all = readStore(PROGRESS_KEY);
  delete all[path];
  writeStore(PROGRESS_KEY, all);
}
function bestFor(path) {
  const b = readStore(BEST_KEY)[path];
  return b && typeof b === "object" ? b : { best: null, last: null };
}
function recordFinish() {
  // Called when a test is fully answered: remember this score as the last
  // one, and as the best if it tops the previous best.
  const all = readStore(BEST_KEY);
  const prev = bestFor(testPath);
  all[testPath] = {
    best: prev.best === null ? score : Math.max(prev.best, score),
    last: score,
  };
  writeStore(BEST_KEY, all);
}
function isFinished() {
  return questions.length > 0 && Object.keys(picked).length === questions.length;
}
function updateBestLine() {
  const b = bestFor(testPath);
  const parts = [];
  if (b.best !== null) parts.push("Best score on this test: " + b.best);
  if (b.last !== null) parts.push("Last score: " + b.last);
  $("bestLine").textContent = parts.join(" · ");
}
function retakeTest() {
  // Start this test over from question 1 with a clean score. The best and
  // last scores stay saved, so there is always a score to beat.
  clearProgressFor(testPath);
  current = 0;
  picked = {};
  setScore(0);
  saveProgress();
  renderQuestion();
}

function correctCount() {
  return questions.filter((q, i) => picked[i] !== undefined && q.answers[picked[i]] === q.correctAnswer).length;
}

function setScore(value) {
  score = value;
  $("scoreChip").textContent = "Score: " + score;
}

function renderProgress() {
  const done = Object.keys(picked).length;
  $("progressText").textContent = "Answered " + done + " of " + questions.length;
  $("progressScore").textContent = "Correct " + correctCount() + " · Score " + score;
  $("progressFill").style.width = questions.length ? (done / questions.length) * 100 + "%" : "0%";
}

function renderNav() {
  const nav = $("navButtons");
  nav.innerHTML = "";
  questions.forEach((q, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = i + 1;
    if (i === current) b.classList.add("current");
    if (picked[i] !== undefined) {
      b.classList.add(q.answers[picked[i]] === q.correctAnswer ? "right" : "wrong");
    }
    b.addEventListener("click", () => { current = i; saveProgress(); renderQuestion(); });
    nav.appendChild(b);
  });
}

function renderQuestion() {
  const q = questions[current];
  if (!q) return;
  $("questionChip").textContent = "Question " + (current + 1) + " of " + questions.length;
  const cat = $("categoryChip");
  if (q.category) { cat.textContent = q.category; cat.hidden = false; }
  else { cat.hidden = true; }
  $("questionText").textContent = q.question;

  const list = $("answersList");
  list.innerHTML = "";
  const answered = picked[current] !== undefined;
  q.answers.forEach((a, i) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    if (picked[current] === i) label.classList.add("picked");
    if (answered) {
      label.classList.add("answered");
      if (a === q.correctAnswer) label.classList.add("correct");
      if (picked[current] === i && a !== q.correctAnswer) label.classList.add("wrong");
    }
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = String(i);
    radio.checked = picked[current] === i;
    radio.disabled = answered;
    const span = document.createElement("span");
    span.textContent = LETTERS[i] + ". " + a;
    label.appendChild(radio);
    label.appendChild(span);
    label.addEventListener("click", (e) => {
      // Let the radio change fire the answer; a click on a disabled/answered
      // label does nothing.
      if (picked[current] !== undefined) e.preventDefault();
    });
    li.appendChild(label);
    list.appendChild(li);
  });

  const fb = $("feedback");
  if (answered) {
    const isRight = q.answers[picked[current]] === q.correctAnswer;
    fb.className = "alert " + (isRight ? "success" : "error");
    fb.hidden = false;
    fb.innerHTML = "";
    const main = document.createElement("div");
    main.textContent = isRight
      ? "Correct! +5 points."
      : "Not quite — the correct answer is " + q.correctAnswer + ". −1 point.";
    fb.appendChild(main);
    if (q.explanation) {
      const ex = document.createElement("div");
      ex.textContent = q.explanation;
      fb.appendChild(ex);
    }
    if (q.reference) {
      const ref = document.createElement("div");
      const em = document.createElement("i");
      em.textContent = q.reference;
      ref.appendChild(em);
      fb.appendChild(ref);
    }
  } else {
    fb.hidden = true;
    fb.textContent = "";
  }

  $("prevBtn").disabled = current === 0;
  $("nextQBtn").disabled = current === questions.length - 1;
  $("completeCard").hidden = !isFinished();
  if (!$("completeCard").hidden) {
    const b = bestFor(testPath);
    $("completeText").textContent =
      "You got " + correctCount() + " of " + questions.length + " right. Final score: " + score + ".";
    $("beatLine").textContent = b.best !== null && score < b.best
      ? "Score to beat: " + b.best + " — retake it and top it."
      : (b.best !== null && score >= b.best
        ? "That's a new best score for this test. Nice work."
        : "Retake it anytime to beat this score.");
  }
  updateBestLine();
  renderNav();
  renderProgress();
}

function answer(i) {
  if (!questions[current] || picked[current] !== undefined) return; // one score per question
  const isRight = questions[current].answers[i] === questions[current].correctAnswer;
  picked[current] = i;
  setScore(score + (isRight ? 5 : -1));
  saveProgress();
  if (isFinished()) recordFinish();
  renderQuestion();
}

async function loadSet(path) {
  testPath = path;
  const chosen = QUIZ_SETS.find((s) => s.path === path) || QUIZ_SETS[0];
  $("testSelect").value = path;
  $("testInfo").textContent = chosen.label + " — loading…";
  $("loading").hidden = false;
  $("errorBox").hidden = true;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Could not load " + path + " (" + res.status + ")");
    const data = await res.json();
    questions = (data.questions || []).map(normalizeQuestion);
    // Pick up where you left off on this test, if there is a saved spot.
    const saved = savedProgressFor(path);
    const resumed = saved && Object.keys(saved.picked || {}).length > 0;
    if (saved) {
      current = Math.min(saved.current, questions.length - 1);
      picked = {};
      Object.keys(saved.picked || {}).forEach((k) => {
        const qi = Number(k), ai = Number(saved.picked[k]);
        if (qi >= 0 && qi < questions.length && ai >= 0 && ai < 5) picked[qi] = ai;
      });
      setScore(saved.score);
    } else {
      current = 0;
      picked = {};
      setScore(0);
    }
    $("testInfo").textContent =
      chosen.label + " — " + questions.length + " questions · +5 for a right answer, −1 for a wrong one" +
      (resumed ? " · Picked up where you left off." : "");
    renderQuestion();
  } catch (err) {
    $("errorBox").textContent = err.message;
    $("errorBox").hidden = false;
  } finally {
    $("loading").hidden = true;
  }
}

function nextTest() {
  const i = QUIZ_SETS.findIndex((s) => s.path === testPath);
  loadSet(QUIZ_SETS[(i + 1) % QUIZ_SETS.length].path);
}

function setup() {
  // Guard against double-init (e.g. DOMContentLoaded firing twice).
  if (document.body.dataset.quizSetup) return;
  document.body.dataset.quizSetup = "1";
  const sel = $("testSelect");
  QUIZ_SETS.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.path;
    opt.textContent = s.label;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", () => loadSet(sel.value));
  $("nextTestBtn").addEventListener("click", nextTest);
  $("retakeBtn").addEventListener("click", retakeTest);
  $("retakeBtn2").addEventListener("click", retakeTest);
  $("prevBtn").addEventListener("click", () => { if (current > 0) { current--; saveProgress(); renderQuestion(); } });
  $("nextQBtn").addEventListener("click", () => { if (current < questions.length - 1) { current++; saveProgress(); renderQuestion(); } });
  $("tryNextBtn").addEventListener("click", nextTest);
  // One listener for all answers.
  $("answersList").addEventListener("change", (e) => {
    if (e.target && e.target.matches('input[type="radio"]')) answer(Number(e.target.value));
  });
  // Start on the test you were last working on, or the first existing test
  // (the one that was in the app already) if there is no saved spot.
  const last = readStore(PROGRESS_KEY)._lastTest;
  loadSet(QUIZ_SETS.some((s) => s.path === last) ? last : QUIZ_SETS[0].path);
}

document.addEventListener("DOMContentLoaded", setup);
