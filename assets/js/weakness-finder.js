// Diagnostic Weakness Finder Engine
const diagnosticQuestions = [
  {
    topic: 'Subject-Verb Agreement',
    question: 'The quality of these mangoes ______ not up to the standard expected by the export committee.',
    options: ['are', 'were', 'is', 'have been'],
    correct: 2,
    rule: 'The subject is "quality" (singular), not "mangoes".'
  },
  {
    topic: 'Subject-Verb Agreement',
    question: 'Bread and butter ______ his only wholesome breakfast for over twenty years.',
    options: ['are', 'is', 'were', 'have been'],
    correct: 1,
    rule: 'When two nouns express a single compound idea, the verb is singular.'
  },
  {
    topic: 'Prepositions',
    question: 'The officer is senior ______ me by three years in service.',
    options: ['than', 'to', 'from', 'with'],
    correct: 1,
    rule: 'Adjectives ending in -ior (senior, junior, superior, inferior, prior) take "to", never "than".'
  },
  {
    topic: 'Prepositions',
    question: 'He died ______ cholera after drinking contaminated water during his trek.',
    options: ['from', 'with', 'by', 'of'],
    correct: 3,
    rule: 'One dies "of" a disease, but dies "from" an external cause (e.g., loss of blood, overwork).'
  },
  {
    topic: 'Modal Auxiliaries',
    question: 'Candidates ______ submit their admit cards prior to entering the exam hall without fail.',
    options: ['might', 'must', 'could', 'would'],
    correct: 1,
    rule: '"Must" indicates strict compulsory obligation.'
  },
  {
    topic: 'Modal Auxiliaries',
    question: 'I ______ rather starve than beg for charity.',
    options: ['should', 'would', 'could', 'might'],
    correct: 1,
    rule: 'The expression of preference always takes "would rather... than".'
  },
  {
    topic: 'Tenses',
    question: 'By this time next year, she ______ her doctoral dissertation.',
    options: ['will complete', 'will have completed', 'completed', 'has completed'],
    correct: 1,
    rule: 'Future Perfect Tense ("will have completed") denotes an action completed by a specified future time.'
  },
  {
    topic: 'Direct & Indirect Speech',
    question: 'He said, "Alas! I am ruined." (Convert to Indirect Speech):',
    options: [
      'He exclaimed with sorrow that he was ruined.',
      'He said alas that he is ruined.',
      'He exclaimed sadly that I am ruined.',
      'He told that he had been ruined.'
    ],
    correct: 0,
    rule: '"Alas!" expresses sorrow and converts to "exclaimed with sorrow that...".'
  },
  {
    topic: 'Question Tags',
    question: 'Nobody phoned while I was out, ______?',
    options: ['did he', 'did they', 'didn\'t they', 'do they'],
    correct: 1,
    rule: 'Indefinite pronouns like "nobody/no one" take the plural pronoun "they" in the tag. Since "nobody" is negative, the tag must be positive ("did they?").'
  },
  {
    topic: 'Articles',
    question: '______ higher you climb, ______ colder it gets.',
    options: ['The, the', 'A, a', 'The, a', 'No article, the'],
    correct: 0,
    rule: 'Parallel comparative structures require the definite article "The... the...".'
  }
];

export function initWeaknessFinder() {
  const container = document.getElementById('weakness-finder-root');
  if (!container) return;

  let currentIdx = 0;
  const userResults = [];

  function renderQuestion() {
    if (currentIdx >= diagnosticQuestions.length) {
      renderDiagnosticResults();
      return;
    }

    const q = diagnosticQuestions[currentIdx];
    const pct = ((currentIdx) / diagnosticQuestions.length) * 100;

    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header-bar">
          <span style="font-size: var(--fs-sm); font-weight: var(--fw-bold); color: var(--primary);">Diagnostic Test (${currentIdx + 1} of ${diagnosticQuestions.length})</span>
          <div class="quiz-progress-wrap">
            <div class="quiz-progress-track">
              <div class="quiz-progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
          <span class="badge badge-exam">${escapeHtml(q.topic)}</span>
        </div>

        <div class="quiz-question-box">
          <div class="quiz-question-topic">${escapeHtml(q.topic)}</div>
          <h2 class="quiz-question-text">${escapeHtml(q.question)}</h2>

          <div class="quiz-options-list">
            ${q.options.map((opt, oIdx) => `
              <button type="button" class="quiz-opt-btn" data-oidx="${oIdx}">
                <span class="option-letter">${String.fromCharCode(65 + oIdx)}</span>
                <span>${escapeHtml(opt)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = Number(btn.getAttribute('data-oidx'));
        const isCorrect = picked === q.correct;

        userResults.push({
          topic: q.topic,
          isCorrect,
          question: q.question,
          rule: q.rule
        });

        currentIdx++;
        renderQuestion();
      });
    });
  }

  function renderDiagnosticResults() {
    // Tally by topic
    const topicAnalysis = {};
    userResults.forEach(r => {
      if (!topicAnalysis[r.topic]) topicAnalysis[r.topic] = { correct: 0, total: 0 };
      topicAnalysis[r.topic].total++;
      if (r.isCorrect) topicAnalysis[r.topic].correct++;
    });

    const weaknesses = [];
    const strengths = [];

    Object.keys(topicAnalysis).forEach(topic => {
      const stats = topicAnalysis[topic];
      const rate = stats.correct / stats.total;
      if (rate < 0.7) {
        weaknesses.push({ topic, ...stats });
      } else {
        strengths.push({ topic, ...stats });
      }
    });

    const totalCorrect = userResults.filter(r => r.isCorrect).length;
    const totalQuestions = userResults.length;
    const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

    container.innerHTML = `
      <div class="quiz-summary-card" style="max-width: 800px; margin: 0 auto;">
        <span class="badge badge-primary" style="margin-bottom: var(--space-2);">Grammar Diagnostic Report</span>
        <h2 style="font-size: var(--fs-3xl); font-weight: var(--fw-extrabold); margin-bottom: var(--space-4);">Diagnostic Analysis Completed</h2>
        
        <div class="score-circle" style="--score-pct: ${accuracy};">
          <div class="score-circle-inner">
            <div class="score-number">${totalCorrect}/${totalQuestions}</div>
            <div class="score-label">${accuracy}% Score</div>
          </div>
        </div>

        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto var(--space-6);">
          ${accuracy >= 80
            ? 'Impressive grammatical accuracy! You have strong grasp over advanced rules with minor blind spots.'
            : 'We identified specific high-frequency exam traps where marks were lost. Review your personalized topic prescription below.'}
        </p>

        <div class="quiz-analysis-grid">
          <div class="analysis-col weak-col">
            <div class="analysis-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Identified Weaknesses (${weaknesses.length})</span>
            </div>
            ${weaknesses.length > 0 ? `
              <div style="display: flex; flex-direction: column; gap: var(--space-2);">
                ${weaknesses.map(w => `
                  <div style="display: flex; justify-content: space-between; font-size: var(--fs-sm); padding: var(--space-2) 0; border-bottom: 1px solid var(--accent-red-border);">
                    <strong style="color: var(--accent-red);">${escapeHtml(w.topic)}</strong>
                    <span>${w.correct}/${w.total} correct</span>
                  </div>
                `).join('')}
              </div>
            ` : '<div style="font-size: var(--fs-sm); color: var(--text-muted);">None! You answered all topics correctly.</div>'}
          </div>

          <div class="analysis-col strong-col">
            <div class="analysis-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Mastered Areas (${strengths.length})</span>
            </div>
            ${strengths.length > 0 ? `
              <div style="display: flex; flex-direction: column; gap: var(--space-2);">
                ${strengths.map(s => `
                  <div style="display: flex; justify-content: space-between; font-size: var(--fs-sm); padding: var(--space-2) 0; border-bottom: 1px solid var(--accent-green-border);">
                    <strong style="color: var(--accent-green);">${escapeHtml(s.topic)}</strong>
                    <span>${s.correct}/${s.total} correct</span>
                  </div>
                `).join('')}
              </div>
            ` : '<div style="font-size: var(--fs-sm); color: var(--text-muted);">Practice required across fundamental topics.</div>'}
          </div>
        </div>

        <div class="recommended-step-box">
          <h3 style="font-size: var(--fs-xl); font-weight: var(--fw-bold); margin-bottom: var(--space-2);">Your Personalized eBook Prescription</h3>
          <p style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">
            To eliminate your errors in <strong>${weaknesses.map(w => w.topic).join(', ') || 'English Grammar'}</strong>, our author recommends the following comprehensive handbook on Amazon KDP:
          </p>

          <div style="display: flex; gap: var(--space-4); align-items: center; background: var(--bg-surface); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: left;">
            <img src="/assets/images/books/sva-cover.webp" alt="Recommended Book" style="width: 70px; height: 100px; object-fit: cover; border-radius: var(--radius-sm);" />
            <div style="flex: 1;">
              <div style="font-size: var(--fs-base); font-weight: var(--fw-bold);">${weaknesses[0] ? escapeHtml(weaknesses[0].topic) + ' Mastery Guide' : 'English Grammar Error Spotting Handbook'}</div>
              <div style="font-size: var(--fs-xs); color: var(--text-muted); margin-bottom: var(--space-2);">200+ Solved Traps, Real Exam PYQs &amp; Step-by-Step Rules</div>
              <div style="display: flex; gap: var(--space-2);">
                <a href="/pages/books.html" class="btn btn-secondary btn-xs">View Book Details</a>
                <a href="https://www.amazon.com/dp/B0EXAMP001" target="_blank" rel="noopener noreferrer" class="btn btn-amazon btn-xs">Buy on Amazon KDP</a>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: var(--space-6);">
          <button class="btn btn-outline" id="retake-diagnostic-btn">Retake Diagnostic Test</button>
        </div>
      </div>
    `;

    const retakeBtn = document.getElementById('retake-diagnostic-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        currentIdx = 0;
        userResults.length = 0;
        renderQuestion();
      });
    }
  }

  renderQuestion();
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initWeaknessFinder);
}
