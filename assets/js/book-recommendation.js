// Smart Book Recommendation Engine
let booksCache = [];

export function initBookRecommendationWizard() {
  const wizardContainer = document.getElementById('book-wizard-container');
  if (!wizardContainer) return;

  // Pre-fetch books
  fetch('/api/books').then(r => r.json()).then(b => { booksCache = b; }).catch(() => {});

  let step = 1;
  let selectedExam = '';
  let selectedLevel = '';
  let selectedTopic = '';

  const step1 = document.getElementById('wizard-step-1');
  const step2 = document.getElementById('wizard-step-2');
  const step3 = document.getElementById('wizard-step-3');
  const resultCard = document.getElementById('wizard-result');

  // Step 1: Target Exam
  wizardContainer.querySelectorAll('.wizard-exam-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedExam = btn.getAttribute('data-val');
      step = 2;
      updateStepViews();
    });
  });

  // Step 2: Grammar Level
  wizardContainer.querySelectorAll('.wizard-level-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedLevel = btn.getAttribute('data-val');
      step = 3;
      updateStepViews();
    });
  });

  // Step 3: Toughest Topic
  wizardContainer.querySelectorAll('.wizard-topic-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTopic = btn.getAttribute('data-val');
      computeAndShowRecommendation();
    });
  });

  // Reset button
  const resetBtn = document.getElementById('wizard-restart-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      step = 1;
      selectedExam = '';
      selectedLevel = '';
      selectedTopic = '';
      updateStepViews();
    });
  }

  function updateStepViews() {
    if (step1) step1.style.display = step === 1 ? 'block' : 'none';
    if (step2) step2.style.display = step === 2 ? 'block' : 'none';
    if (step3) step3.style.display = step === 3 ? 'block' : 'none';
    if (resultCard) resultCard.style.display = step === 4 ? 'block' : 'none';

    // Dots
    const dots = wizardContainer.querySelectorAll('.wizard-step-dot');
    dots.forEach((dot, idx) => {
      if (idx + 1 <= step) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  async function computeAndShowRecommendation() {
    step = 4;
    updateStepViews();

    if (booksCache.length === 0) {
      try {
        booksCache = await fetch('/api/books').then(r => r.json());
      } catch (e) {
        console.error(e);
      }
    }

    // Match best book based on selectedTopic
    let match = booksCache.find(b => (b.topic || '').toLowerCase().includes(selectedTopic.toLowerCase()));

    // Fallbacks
    if (!match && selectedTopic === 'modals') {
      match = booksCache.find(b => b.slug.includes('modal'));
    }
    if (!match && selectedTopic === 'shortcuts') {
      match = booksCache.find(b => b.slug.includes('shortcut'));
    }
    if (!match) {
      match = booksCache[0];
    }

    const titleEl = document.getElementById('wizard-rec-title');
    const topicEl = document.getElementById('wizard-rec-topic');
    const reasonEl = document.getElementById('wizard-rec-reason');
    const imgEl = document.getElementById('wizard-rec-img');
    const viewBtn = document.getElementById('wizard-rec-view');
    const amazonBtn = document.getElementById('wizard-rec-amazon');

    if (titleEl) titleEl.textContent = match.title;
    if (topicEl) topicEl.textContent = match.topic;
    if (reasonEl) {
      reasonEl.textContent = `Based on your goal for ${selectedExam || 'Competitive Exams'} and your need to strengthen ${selectedTopic || match.topic}, this guide breaks down every rule, high-frequency trap, and exam mistake so you achieve 100% accuracy.`;
    }
    if (imgEl && match.coverImage) {
      imgEl.src = match.coverImage;
      imgEl.alt = match.coverImageAlt || match.title;
    }
    if (viewBtn) {
      viewBtn.href = `/pages/book-details.html?slug=${match.slug}`;
    }
    if (amazonBtn) {
      amazonBtn.href = match.amazonUrl || '#';
      amazonBtn.setAttribute('data-amazon-book', match.id || match.slug);
      amazonBtn.setAttribute('data-book-title', match.title);
    }
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initBookRecommendationWizard);
}
