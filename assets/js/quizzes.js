// Quiz Platform Engine
import { trackQuizCompleted } from './analytics.js';

let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let timerInterval = null;
let secondsRemaining = 300; // 5 mins
let isTimerActive = true;

export async function initQuizPlatform() {
  const container = document.getElementById('quiz-interactive-wrap');
  if (!container) return;

  try {
    const res = await fetch('/api/quizzes');
    const quizzes = await res.json();
    if (quizzes.length > 0 && quizzes[0].questions) {
      quizQuestions = quizzes[0].questions;
    } else {
      // Fallback questions if not parsed yet
      quizQuestions = getDefaultQuizQuestions();
    }
    startQuiz();
  } catch (err) {
    console.error('Failed to load quizzes', err);
    quizQuestions = getDefaultQuizQuestions();
    startQuiz();
  }
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  secondsRemaining = 300;

  initTimer();
  renderCurrentQuestion();
}

function initTimer() {
  const timerEl = document.getElementById('quiz-timer-display');
  const timerToggle = document.getElementById('quiz-timer-toggle');

  if (timerToggle) {
    timerToggle.addEventListener('change', (e) => {
      isTimerActive = e.target.checked;
      if (!isTimerActive && timerInterval) {
        clearInterval(timerInterval);
        if (timerEl) timerEl.textContent = 'Untimed';
      } else if (isTimerActive) {
        startTimerCountdown();
      }
    });
  }

  startTimerCountdown();
}

function startTimerCountdown() {
  if (timerInterval) clearInterval(timerInterval);
  const timerEl = document.getElementById('quiz-timer-display');

  timerInterval = setInterval(() => {
    if (!isTimerActive) return;
    secondsRemaining--;

    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
      return;
    }

    if (timerEl) {
      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (secondsRemaining < 60) {
        timerEl.classList.add('time-warning');
      }
    }
  }, 1000);
}

function renderCurrentQuestion() {
  const qBox = document.getElementById('quiz-question-box');
  const progressFill = document.getElementById('quiz-progress-fill');
  const countEl = document.getElementById('quiz-counter');

  if (!qBox || currentIndex >= quizQuestions.length) {
    finishQuiz();
    return;
  }

  const q = quizQuestions[currentIndex];
  const progressPct = ((currentIndex) / quizQuestions.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPct}%`;
  if (countEl) countEl.textContent = `Question ${currentIndex + 1} of ${quizQuestions.length}`;

  const options = Array.isArray(q.options) ? q.options : q.options.split('|');

  qBox.innerHTML = `
    <div class="quiz-question-topic">${escapeHtml(q.topic || 'English Grammar')}</div>
    <h3 class="quiz-question-text">${escapeHtml(q.question)}</h3>
    <div class="quiz-options-list">
      ${options.map((opt, idx) => `
        <button type="button" class="quiz-opt-btn" data-idx="${idx}">
          <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
          <span>${escapeHtml(opt)}</span>
        </button>
      `).join('')}
    </div>
    <div class="quiz-explanation-box" id="quiz-explanation-box">
      <strong>Explanation:</strong> ${escapeHtml(q.explanation || '')}
    </div>
    <div class="quiz-footer-actions">
      <span style="font-size: var(--fs-xs); color: var(--text-muted);">Difficulty: ${escapeHtml(q.difficulty || 'Intermediate')}</span>
      <button class="btn btn-primary" id="quiz-next-btn" style="display: none;">Next Question →</button>
    </div>
  `;

  // Bind option clicks
  const btns = qBox.querySelectorAll('.quiz-opt-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const expBox = document.getElementById('quiz-explanation-box');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedIdx = Number(btn.getAttribute('data-idx'));
      const correctIdx = Number(q.correctAnswerIndex);
      const isCorrect = selectedIdx === correctIdx;

      if (isCorrect) score++;
      userAnswers.push({
        topic: q.topic,
        isCorrect,
        question: q.question
      });

      btns.forEach(b => {
        b.disabled = true;
        if (Number(b.getAttribute('data-idx')) === correctIdx) {
          b.classList.add('correct');
        }
      });

      if (!isCorrect) {
        btn.classList.add('wrong');
      }

      if (expBox) expBox.style.display = 'block';
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.focus();
        nextBtn.addEventListener('click', () => {
          currentIndex++;
          renderCurrentQuestion();
        });
      }
    });
  });
}

function finishQuiz() {
  if (timerInterval) clearInterval(timerInterval);

  const container = document.getElementById('quiz-interactive-wrap');
  if (!container) return;

  const total = quizQuestions.length;
  const pct = Math.round((score / total) * 100);

  // Analyze strong vs weak topics
  const topicStats = {};
  userAnswers.forEach(ans => {
    if (!topicStats[ans.topic]) topicStats[ans.topic] = { correct: 0, total: 0 };
    topicStats[ans.topic].total++;
    if (ans.isCorrect) topicStats[ans.topic].correct++;
  });

  const strongTopics = [];
  const weakTopics = [];

  Object.keys(topicStats).forEach(top => {
    const rate = topicStats[top].correct / topicStats[top].total;
    if (rate >= 0.7) strongTopics.push(top);
    else weakTopics.push(top);
  });

  trackQuizCompleted('comprehensive-grammar-quiz', score, total, weakTopics);

  container.innerHTML = `
    <div class="quiz-summary-card">
      <span class="badge badge-primary" style="margin-bottom: var(--space-3);">Quiz Completed</span>
      <h2 style="font-size: var(--fs-3xl); font-weight: var(--fw-extrabold); margin-bottom: var(--space-4);">Your Performance Summary</h2>
      
      <div class="score-circle" style="--score-pct: ${pct};">
        <div class="score-circle-inner">
          <div class="score-number">${score}/${total}</div>
          <div class="score-label">${pct}% Accuracy</div>
        </div>
      </div>

      <p style="color: var(--text-secondary); max-width: 540px; margin: 0 auto var(--space-6);">
        ${pct >= 80 ? 'Exceptional mastery! You demonstrate solid command over core grammar rules and exam traps.' : pct >= 50 ? 'Good foundation! A few specific topics need systematic revision before competitive exam day.' : 'Needs focused attention! Study the recommended rules and error-spotting guides below.'}
      </p>

      <div class="quiz-analysis-grid">
        <div class="analysis-col strong-col">
          <div class="analysis-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Strong Areas</span>
          </div>
          <div class="topic-tag-list">
            ${strongTopics.length > 0 ? strongTopics.map(t => `<span class="badge badge-success">${escapeHtml(t)}</span>`).join('') : '<span style="font-size: var(--fs-xs); color: var(--text-muted);">None identified yet</span>'}
          </div>
        </div>

        <div class="analysis-col weak-col">
          <div class="analysis-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Focus Areas (Needs Practice)</span>
          </div>
          <div class="topic-tag-list">
            ${weakTopics.length > 0 ? weakTopics.map(t => `<span class="badge badge-danger">${escapeHtml(t)}</span>`).join('') : '<span style="font-size: var(--fs-xs); color: var(--text-muted);">Zero errors in tested topics!</span>'}
          </div>
        </div>
      </div>

      <div class="recommended-step-box">
        <h4 style="font-size: var(--fs-lg); font-weight: var(--fw-bold); margin-bottom: var(--space-2);">Recommended Next Step</h4>
        <p style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">
          ${weakTopics.length > 0 ? `Strengthen your understanding of <strong>${weakTopics.join(', ')}</strong> with our expert Amazon KDP guides.` : 'Advance to exam-level shortcuts and 500 questions practice.'}
        </p>
        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
          <a href="/pages/practice.html" class="btn btn-secondary btn-sm">Practice Focus Questions</a>
          <a href="/pages/books.html" class="btn btn-primary btn-sm">Browse 14 Author Guides</a>
          <button class="btn btn-outline btn-sm" id="restart-quiz-btn">Retake Quiz</button>
        </div>
      </div>
    </div>
  `;

  const retakeBtn = document.getElementById('restart-quiz-btn');
  if (retakeBtn) retakeBtn.addEventListener('click', startQuiz);
}

function getDefaultQuizQuestions() {
  return [
    {
      topic: 'Subject-Verb Agreement',
      difficulty: 'Intermediate',
      question: 'Neither the teacher nor the students ______ present in the auditorium when the ceremony started.',
      options: ['was', 'were', 'is', 'has been'],
      correctAnswerIndex: 1,
      explanation: 'When two subjects are connected by "neither... nor", the verb agrees with the closer subject ("students", which is plural, hence "were").'
    },
    {
      topic: 'Modal Auxiliaries',
      difficulty: 'Advanced',
      question: 'You ______ have carried an umbrella; the weather report explicitly said it wouldn\'t rain, yet you got soaked regardless.',
      options: ['should', 'needn\'t', 'must', 'could'],
      correctAnswerIndex: 0,
      explanation: '"Should have" expresses an advice or desirable past action that was unfortunately not carried out.'
    },
    {
      topic: 'Prepositions',
      difficulty: 'Intermediate',
      question: 'The committee was unanimous in its decision to abstain ______ voting on the controversial amendment.',
      options: ['from', 'of', 'with', 'to'],
      correctAnswerIndex: 0,
      explanation: 'The verb "abstain" strictly takes the preposition "from" ("abstain from smoking / voting").'
    },
    {
      topic: 'Question Tags',
      difficulty: 'Intermediate',
      question: 'Let us begin the mock examination now, ______?',
      options: ['shall we', 'will you', 'shouldn\'t we', 'can we'],
      correctAnswerIndex: 0,
      explanation: 'Imperative sentences beginning with "Let us / Let\'s" always take the question tag "shall we?".'
    },
    {
      topic: 'Active & Passive Voice',
      difficulty: 'Intermediate',
      question: 'Choose the correct passive voice: "They are renovating the old library building."',
      options: [
        'The old library building is renovated by them.',
        'The old library building is being renovated by them.',
        'The old library building has been renovated.',
        'The old library building was being renovated.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Present continuous active ("are renovating") changes to "is/are being + V3" ("is being renovated").'
    },
    {
      topic: 'Direct & Indirect Speech',
      difficulty: 'Advanced',
      question: 'He said to me, "Where did you buy this grammar book?" (Select correct indirect speech):',
      options: [
        'He asked me where had I bought that grammar book.',
        'He asked me where I had bought that grammar book.',
        'He enquired where did I buy this grammar book.',
        'He told me where I bought that grammar book.'
      ],
      correctAnswerIndex: 1,
      explanation: 'In indirect wh-questions, the word order becomes assertive (subject + verb: "where I had bought") and "this" changes to "that".'
    }
  ];
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initQuizPlatform);
}
