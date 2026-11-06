// conQuiz - fixed version
// Flow: pick a question on top, its 5 answers fill in below (A-E).
// Click an answer once: +5 if right, -1 if wrong. That question is then locked.
// "Next test" loads the next test in the menu and resets the score.
// The menu keeps all the existing tests and adds the KB-2 test as the last one.
// Works with both JSON shapes:
//   old: { questions: [{ question, answers: [...5], correctAnswer: "text" }] }
//        (c1.json uses a number instead: correctAnswer: 1  -> answers[1])
//   new KB-2: { questions: [{ question, choices: [...5], answerIndex: 1 }] }

const QUIZ_SETS = [
  { path: "J_son/c0.json", label: "Carpentry / IBC" },
  { path: "J_son/c1.json", label: "Carpentry (30)" },
  { path: "J_son/c2.json", label: "Carpentry basics" },
  { path: "J_son/c3.json", label: "IBC" },
  { path: "J_son/s0.json", label: "Stairs" },
  { path: "J_son/s1.json", label: "Stairs 2" },
  { path: "J_son/s2.json", label: "Stairs 3" },
  { path: "J_son/s3.json", label: "Stairs / IBC" },
  { path: "J_son/s4.json", label: "Stairs / Arizona" },
  { path: "J_son/kb2.json", label: "Arizona KB-2 (30)" },
];

const LETTERS = ["A", "B", "C", "D", "E"];

let questions = [];       // normalized: { question, answers[5], correctAnswer }
let currentIndex = -1;    // which question is selected, -1 = none
let answered = {};        // question index -> true once scored
let score = 0;
let currentSetPath = "";

function getIt(sel) { return document.querySelector(sel); }

// --- normalize one question, whatever shape the JSON uses ---
function normalizeQuestion(raw) {
  const answers = (raw.answers || raw.choices || []).slice(0, 5);
  let correct = raw.correctAnswer;
  if (typeof correct === "number") correct = answers[correct];
  if (typeof raw.answerIndex === "number") correct = answers[raw.answerIndex];
  // Old bad data said "Oak or Maple" when both were choices: take the first one listed.
  if (typeof correct === "string" && !answers.includes(correct)) {
    const parts = correct.split(/\s+or\s+/);
    const found = parts.find((p) => answers.includes(p));
    if (found) correct = found;
  }
  return {
    question: raw.question,
    answers,
    correctAnswer: correct,
    explanation: raw.explanation || "",
    reference: raw.reference || "",
  };
}

function setScore(value) {
  score = value;
  const el = getIt("#score");
  if (el) el.setAttribute("data-scr", String(score));
}

function updateProgress() {
  const done = Object.keys(answered).length;
  const el = getIt("#progress");
  if (el) el.textContent = questions.length
    ? "Answered " + done + " of " + questions.length
    : "";
}

function clearAnswers() {
  LETTERS.forEach((letter, i) => {
    const label = getIt("#label" + i);
    const radio = getIt("#answer" + i);
    if (label) {
      label.textContent = letter;
      label.style.background = "";
      label.style.color = "";
    }
    if (radio) radio.checked = false;
  });
}

function renderQuestions() {
  const list = getIt("#questions");
  list.innerHTML = "";
  questions.forEach((q, i) => {
    const span = document.createElement("span");
    span.id = "question" + i;
    span.dataset.index = String(i);
    span.textContent = (i + 1) + ". " + q.question;
    list.appendChild(span);
  });
}

function selectQuestion(i) {
  if (i < 0 || i >= questions.length) return;
  currentIndex = i;
  document.querySelectorAll("#questions span").forEach((s) => {
    s.classList.toggle("active", Number(s.dataset.index) === i);
  });
  const q = questions[i];
  LETTERS.forEach((letter, j) => {
    const label = getIt("#label" + j);
    const radio = getIt("#answer" + j);
    if (label) {
      label.textContent = letter + ". " + (q.answers[j] || "");
      label.style.background = "";
      label.style.color = "";
    }
    if (radio) radio.checked = false;
  });
  // If this question was already answered, show the result again.
  if (answered[i]) showResult(i);
}

function showResult(i) {
  const q = questions[i];
  const correctIndex = q.answers.indexOf(q.correctAnswer);
  LETTERS.forEach((letter, j) => {
    const label = getIt("#label" + j);
    if (!label) return;
    if (j === correctIndex) {
      label.style.background = "#0f0";
      label.style.color = "#000";
    }
  });
}

function answerQuestion(j) {
  if (currentIndex < 0) return;               // pick a question first
  if (answered[currentIndex]) return;         // one score per question
  const q = questions[currentIndex];
  const label = getIt("#label" + j);
  const radio = getIt("#answer" + j);
  if (radio) radio.checked = true;
  answered[currentIndex] = true;
  if (q.answers[j] === q.correctAnswer) {
    setScore(score + 5);
    if (label) { label.style.background = "#0f0"; label.style.color = "#000"; }
  } else {
    setScore(score - 1);
    if (label) { label.style.background = "#f005"; }
    showResult(currentIndex);  // also highlight the right one
  }
  updateProgress();
}

async function loadSet(path, label) {
  currentSetPath = path;
  const nameEl = getIt("#setName");
  if (nameEl) nameEl.textContent = "Set: " + label;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status + " loading " + path);
    const data = await res.json();
    questions = (data.questions || []).map(normalizeQuestion);
    currentIndex = -1;
    answered = {};
    setScore(0);
    clearAnswers();
    renderQuestions();
    updateProgress();
  } catch (err) {
    console.error(err);
    const list = getIt("#questions");
    if (list) list.textContent = "Could not load " + path + ". " + err.message;
  }
}

function loadNextSet() {
  const i = QUIZ_SETS.findIndex((s) => s.path === currentSetPath);
  const pick = QUIZ_SETS[(i + 1) % QUIZ_SETS.length];
  loadSet(pick.path, pick.label);
  const select = getIt("#setSelect");
  if (select) select.value = pick.path;
}

function setup() {
  // Clone the template into the page (once). Guard against double-init.
  if (document.body.dataset.quizSetup) return;
  document.body.dataset.quizSetup = "1";
  document.body.appendChild(getIt("#card").content.cloneNode(true));

  const select = getIt("#setSelect");
  QUIZ_SETS.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.path;
    opt.textContent = s.label;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    const chosen = QUIZ_SETS.find((s) => s.path === select.value);
    if (chosen) loadSet(chosen.path, chosen.label);
  });

  getIt("#nextBtn").addEventListener("click", loadNextSet);

  // One listener for all questions, one for all answers - no duplicates.
  getIt("#questions").addEventListener("click", (e) => {
    const span = e.target.closest("span");
    if (!span || span.dataset.index === undefined) return;
    selectQuestion(Number(span.dataset.index));
  });
  getIt("#answers").addEventListener("click", (e) => {
    const label = e.target.closest("label");
    if (!label) return;
    const j = Number(label.id.replace("label", ""));
    if (!Number.isNaN(j)) answerQuestion(j);
  });

  // Start on the first existing test, the one that was in the app already.
  loadSet(QUIZ_SETS[0].path, QUIZ_SETS[0].label);
}

window.addEventListener("DOMContentLoaded", setup);
