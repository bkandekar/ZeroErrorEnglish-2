// Practice Zone Controller
let allPracticeQuestions = [];

export async function initPracticeZone() {
  const container = document.getElementById('practice-questions-list');
  if (!container) return;

  container.innerHTML = '<div style="padding: 3rem; text-align: center; color: var(--text-muted);">Loading grammar practice questions...</div>';

  try {
    const res = await fetch('/api/practice');
    allPracticeQuestions = await res.json();
    renderPracticeQuestions(allPracticeQuestions);
    initPracticeFilters();
  } catch (err) {
    console.error('Failed to load practice questions', err);
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--accent-red);">Failed to load practice questions.</div>';
  }
}

export function renderPracticeQuestions(questions) {
  const container = document.getElementById('practice-questions-list');
  if (!container) return;

  if (questions.length === 0) {
    container.innerHTML = '<div style="padding: 3rem; text-align: center; background: var(--bg-surface); border-radius: var(--radius-lg);">No practice questions found for this topic filter.</div>';
    return;
  }

  container.innerHTML = questions.map((q, idx) => {
    const options = Array.isArray(q.options) ? q.options : (q.options || '').split('|').map(o => o.trim());
    return `
      <div class="practice-card" id="practice-card-${q.id || idx}">
        <div class="practice-card-header">
          <span class="practice-type-tag">${escapeHtml(q.type || 'Error Spotting')}</span>
          <div style="display: flex; gap: var(--space-2);">
            <span class="badge badge-exam">${escapeHtml(q.topic || 'Subject-Verb Agreement')}</span>
            <span class="badge badge-exam">${escapeHtml(q.difficulty || 'Intermediate')}</span>
          </div>
        </div>

        ${q.type === 'Error Spotting' ? `
          <div class="error-spotting-sentence">
            ${escapeHtml(q.sentence || q.question || '')}
          </div>
        ` : `
          <div class="edu-practice-question">${escapeHtml(q.question || '')}</div>
        `}

        <div class="practice-options-grid">
          ${options.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            return `
              <button type="button" class="practice-option-btn" data-opt-idx="${oIdx}" data-correct="${oIdx === Number(q.correctAnswerIndex)}">
                <span class="option-letter">${letter}</span>
                <span>${escapeHtml(opt)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div class="practice-feedback-panel" id="feedback-${q.id || idx}">
          <div class="feedback-status-badge"></div>
          <p style="margin-bottom: var(--space-2);">${escapeHtml(q.explanation || '')}</p>
          ${q.ruleCitation ? `
            <div class="feedback-rule-citation">
              <strong>Grammar Rule:</strong> ${escapeHtml(q.ruleCitation)}
            </div>
          ` : ''}
          ${q.relatedBookTitle ? `
            <div class="feedback-book-recommendation">
              <div class="feedback-book-info">
                <strong>Target Guide: ${escapeHtml(q.relatedBookTitle)}</strong>
                <span>Overcome this exact exam trap with full chapter breakdown on Amazon KDP.</span>
              </div>
              <a href="${q.amazonUrl || '/pages/books.html'}" target="_blank" rel="noopener noreferrer" class="btn btn-amazon btn-sm">Buy Guide</a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Bind click handlers for options
  container.querySelectorAll('.practice-card').forEach((card, idx) => {
    const btns = card.querySelectorAll('.practice-option-btn');
    const panel = card.querySelector('.practice-feedback-panel');
    const badge = card.querySelector('.feedback-status-badge');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';

        btns.forEach(b => {
          b.disabled = true;
          if (b.getAttribute('data-correct') === 'true') {
            b.classList.add('correct');
          }
        });

        if (!isCorrect) {
          btn.classList.add('incorrect');
        }

        if (panel) {
          panel.classList.add('is-visible');
          if (badge) {
            badge.innerHTML = isCorrect
              ? '<span class="badge badge-success">✓ Correct Answer!</span>'
              : '<span class="badge badge-danger">✕ Incorrect Choice</span>';
          }
        }
      });
    });
  });
}

function initPracticeFilters() {
  const topicSelect = document.getElementById('practice-topic-filter');
  const typeSelect = document.getElementById('practice-type-filter');

  function filter() {
    const topic = topicSelect ? topicSelect.value : 'all';
    const type = typeSelect ? typeSelect.value : 'all';

    const filtered = allPracticeQuestions.filter(q => {
      const matchTopic = topic === 'all' || (q.topic || '').toLowerCase() === topic.toLowerCase();
      const matchType = type === 'all' || (q.type || '').toLowerCase() === type.toLowerCase();
      return matchTopic && matchType;
    });

    renderPracticeQuestions(filtered);
  }

  if (topicSelect) topicSelect.addEventListener('change', filter);
  if (typeSelect) typeSelect.addEventListener('change', filter);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initPracticeZone);
}
