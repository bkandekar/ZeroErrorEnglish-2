/**
 * ZeroErrorEnglish - Homepage Specific Interactions
 * Handles the interactive Hero Correction Specimen and the Daily Exam Trap Diagnostic widget.
 */

// Hero Specimen Data Store (3 Authentic Exam Traps)
export const heroSpecimens = [
  {
    exam: "SSC CGL Tier-II",
    prefix: "Neither of the two candidates",
    error: "have submitted",
    correct: "has submitted",
    suffix: "their application on time.",
    ruleTitle: "Governing Rule (Subject-Verb Agreement)",
    ruleText: '<strong>"Neither of"</strong> denotes one of two and strictly governs a singular verb (<strong>has</strong>) and singular pronoun (<strong>his/her</strong>), regardless of the plural noun phrase following it.',
    citation: "Handbook 1: <strong>Subject-Verb Agreement Mastery</strong> (Chapter 3, Rule 14)",
    bookLink: "/pages/book-details.html?slug=subject-verb-agreement-mastery"
  },
  {
    exam: "SBI PO Mains",
    prefix: "The managing director is senior",
    error: "than",
    correct: "to",
    suffix: "all executive committee members in tenure.",
    ruleTitle: "Governing Rule (Preposition Trap)",
    ruleText: 'Latin comparative adjectives ending in <strong>-ior</strong> (senior, junior, superior, inferior, prior) are strictly paired with the preposition <strong>to</strong>, never <strong>than</strong>.',
    citation: "Handbook 3: <strong>Prepositions Simplified</strong> (Chapter 4, Rule 9)",
    bookLink: "/pages/book-details.html?slug=prepositions-simplified"
  },
  {
    exam: "UPSC CDS",
    prefix: "If the meteorological team",
    error: "would have warned",
    correct: "had warned",
    suffix: "the coastal administration, the vessels would not have capsized.",
    ruleTitle: "Governing Rule (Third Conditional)",
    ruleText: 'In third conditional hypothetical constructions, the subordinate conditional clause strictly takes the <strong>Past Perfect (had + V3)</strong>. <strong>"Would have"</strong> is never permitted inside the conditional If-clause.',
    citation: "Handbook 8: <strong>Conditionals and Subjunctive Mood</strong> (Chapter 2, Rule 5)",
    bookLink: "/pages/book-details.html?slug=conditionals-and-subjunctive-mood"
  }
];

/**
 * Initializes the Hero Sentence Specimen Switcher tabs
 */
export function initHeroSpecimen() {
  const specimenTabs = document.querySelectorAll('.specimen-tab');
  const heroSpecimen = document.getElementById('hero-correction-specimen');
  if (!heroSpecimen || !specimenTabs.length) return;

  const examTag = document.getElementById('specimen-exam-tag');
  const prefixEl = document.querySelector('.sentence-prefix');
  const errorWordEl = document.getElementById('specimen-error-word');
  const correctWordEl = document.getElementById('specimen-correct-word');
  const suffixEl = document.querySelector('.sentence-suffix');
  const ruleTitleEl = document.getElementById('specimen-rule-title');
  const ruleTextEl = document.getElementById('specimen-rule-text');
  const citationEl = document.getElementById('specimen-book-citation');
  const bookLinkEl = document.getElementById('specimen-book-link');

  specimenTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const index = parseInt(tab.getAttribute('data-specimen') || '0', 10);
      specimenTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = heroSpecimens[index];
      if (!data) return;

      // Reset animation trigger
      heroSpecimen.classList.remove('animated-specimen');
      void heroSpecimen.offsetWidth; // force reflow

      if (examTag) examTag.textContent = data.exam;
      if (prefixEl) prefixEl.textContent = data.prefix;
      if (errorWordEl) errorWordEl.textContent = data.error;
      if (correctWordEl) correctWordEl.textContent = data.correct;
      if (suffixEl) suffixEl.textContent = data.suffix;
      if (ruleTitleEl) ruleTitleEl.textContent = data.ruleTitle;
      if (ruleTextEl) ruleTextEl.innerHTML = data.ruleText;
      if (citationEl) citationEl.innerHTML = data.citation;
      if (bookLinkEl) bookLinkEl.href = data.bookLink;

      heroSpecimen.classList.add('animated-specimen');
    });
  });
}

/**
 * Initializes the Live Exam Trap Diagnostic Widget
 */
export function initTrapTester() {
  const trapButtons = document.querySelectorAll('.trap-part-btn');
  const trapFeedback = document.getElementById('trap-feedback-box');
  const trapStatus = document.getElementById('trap-feedback-status');
  const trapCorrection = document.getElementById('trap-feedback-correction');
  const trapCitation = document.getElementById('trap-feedback-citation');

  if (!trapButtons.length || !trapFeedback) return;

  trapButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trapButtons.forEach(b => {
        b.classList.remove('is-selected-error', 'is-correct-fix');
      });

      const isError = btn.getAttribute('data-error') === 'true';
      trapFeedback.style.display = 'block';

      if (isError) {
        btn.classList.add('is-selected-error');
        if (trapStatus) {
          trapStatus.innerHTML = '<span style="color: var(--success-rule);">✓ Exactly Right! Error Detected in Part [C]</span>';
        }
        if (trapCorrection) {
          trapCorrection.innerHTML = '<strong>Correction:</strong> Replace <em>"when"</em> with <strong>"than"</strong>.<br><span style="font-size: var(--fs-sm); color: var(--text-secondary);">Rule Formula: <strong>No sooner + auxiliary + subject</strong> is correlatively paired strictly with <strong>"than"</strong>, not "when". ("Hardly" and "Scarcely" pair with "when".)</span>';
        }
        if (trapCitation) {
          trapCitation.innerHTML = 'Refer to: <strong>Handbook 7: Conjunctions and Connectors</strong> (Chapter 2, Rule 11)';
        }
      } else {
        if (trapStatus) {
          trapStatus.innerHTML = '<span style="color: var(--error-trap);">✕ Incorrect Selection</span>';
        }
        if (trapCorrection) {
          trapCorrection.innerHTML = 'This segment is grammatically sound. Look closely at Part [C]: <em>"when the students entered"</em> violates correlative inversion.';
        }
        if (trapCitation) {
          trapCitation.innerHTML = 'Correlative Rule: "No sooner" requires "than" to link the main clause.';
        }
        const correctBtn = document.querySelector('.trap-part-btn[data-error="true"]');
        if (correctBtn) correctBtn.classList.add('is-correct-fix');
      }
    });
  });
}

// Auto-run if loaded directly
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroSpecimen();
      initTrapTester();
    });
  } else {
    initHeroSpecimen();
    initTrapTester();
  }
}
