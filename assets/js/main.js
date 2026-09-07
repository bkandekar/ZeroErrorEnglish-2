// Main Application Orchestrator for ZeroErrorEnglish
import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initSearchModal } from './search.js';
import { trackNewsletter } from './analytics.js';

export function initApp() {
  initTheme();
  initNavigation();
  initSearchModal();
  initExamModeSwitcher();
  initDailyChallenge();
  initNewsletterForm();
}

// Exam Mode Quick Switcher (e.g. SSC / Banking / All)
function initExamModeSwitcher() {
  const switcherBtns = document.querySelectorAll('.exam-mode-chip');
  const savedMode = localStorage.getItem('zeroerror_exam_mode') || 'all';

  switcherBtns.forEach(btn => {
    const mode = btn.getAttribute('data-exam-mode');
    if (mode === savedMode) btn.classList.add('active');

    btn.addEventListener('click', () => {
      switcherBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      localStorage.setItem('zeroerror_exam_mode', mode);

      // If on blog or books page, trigger filter
      const event = new CustomEvent('exam-mode-changed', { detail: { mode } });
      window.dispatchEvent(event);
    });
  });
}

// Daily Grammar Challenge (Homepage Section 5)
function initDailyChallenge() {
  const challengeCard = document.getElementById('daily-grammar-challenge');
  if (!challengeCard) return;

  const options = challengeCard.querySelectorAll('.challenge-option-btn');
  const feedback = challengeCard.querySelector('.challenge-feedback');

  options.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';

      options.forEach(b => {
        b.disabled = true;
        if (b.getAttribute('data-correct') === 'true') {
          b.style.backgroundColor = 'var(--accent-green-bg)';
          b.style.borderColor = 'var(--accent-green)';
          b.style.color = 'var(--accent-green)';
          b.style.fontWeight = 'bold';
        }
      });

      if (!isCorrect) {
        btn.style.backgroundColor = 'var(--accent-red-bg)';
        btn.style.borderColor = 'var(--accent-red)';
        btn.style.color = 'var(--accent-red)';
        btn.style.fontWeight = 'bold';
      }

      if (feedback) {
        feedback.style.display = 'block';
        feedback.innerHTML = isCorrect
          ? `<div class="badge badge-success" style="margin-bottom: 0.5rem;">✓ Correct! Rule Mastered</div><p style="font-size: var(--fs-sm);">${feedback.getAttribute('data-explanation') || 'Well done! Collective nouns acting as a single unit take a singular verb.'}</p>`
          : `<div class="badge badge-danger" style="margin-bottom: 0.5rem;">✕ Incorrect Choice</div><p style="font-size: var(--fs-sm);">${feedback.getAttribute('data-explanation') || 'Remember: When the committee acts unanimously as one unit, the verb is singular ("was unanimous").'}</p>`;
      }
    });
  });
}

// Newsletter Subscription Form
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const statusMsg = form.querySelector('.form-feedback') || document.getElementById('newsletter-status');

    if (input && input.value) {
      const email = input.value.trim();
      trackNewsletter(email);
      input.value = '';

      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.innerHTML = '<span class="badge badge-success">✓ Subscribed! Check your inbox for your free Grammar Trap PDF.</span>';
      } else {
        alert('Thank you for subscribing! Free Daily Grammar Tips will be delivered to your inbox.');
      }
    }
  });
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initApp);
}
