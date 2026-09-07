// Search System across Articles, Books, Topics, Practice, and Image Tags
import { trackSearchQuery } from './analytics.js';

let searchIndexCache = null;

export async function getSearchIndex() {
  if (searchIndexCache) return searchIndexCache;

  try {
    const [postsRes, booksRes, topicsRes, practiceRes] = await Promise.all([
      fetch('/api/posts').then(r => r.json()).catch(() => []),
      fetch('/api/books').then(r => r.json()).catch(() => []),
      fetch('/api/topics').then(r => r.json()).catch(() => []),
      fetch('/api/practice').then(r => r.json()).catch(() => [])
    ]);

    const combined = [];

    // Articles
    postsRes.forEach(p => {
      combined.push({
        type: 'Article',
        title: p.title,
        desc: p.excerpt || p.metaDescription || '',
        url: `/blog/article.html?slug=${p.slug}`,
        tags: Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || ''),
        topic: p.grammarTopic || '',
        exam: Array.isArray(p.targetExam) ? p.targetExam.join(' ') : (p.targetExam || '')
      });
    });

    // Books
    booksRes.forEach(b => {
      combined.push({
        type: 'Grammar eBook',
        title: b.title,
        desc: b.description || b.keyBenefits || '',
        url: `/pages/book-details.html?slug=${b.slug}`,
        tags: Array.isArray(b.imageTags) ? b.imageTags.join(' ') : (b.imageTags || ''),
        topic: b.topic || '',
        exam: b.targetAudience || ''
      });
    });

    // Topics
    topicsRes.forEach(t => {
      combined.push({
        type: 'Grammar Topic',
        title: t.title,
        desc: t.description || '',
        url: `/pages/grammar-topics.html?topic=${t.slug}`,
        tags: t.title,
        topic: t.title,
        exam: 'All Exams'
      });
    });

    // Practice
    practiceRes.forEach(pr => {
      combined.push({
        type: 'Practice Question',
        title: pr.title || pr.question || 'Practice Question',
        desc: pr.ruleCitation || pr.explanation || '',
        url: `/pages/practice.html?topic=${pr.topic || ''}`,
        tags: pr.topic || '',
        topic: pr.topic || '',
        exam: pr.exam || ''
      });
    });

    searchIndexCache = combined;
    return combined;
  } catch (err) {
    console.error('Failed to load search index', err);
    return [];
  }
}

export function performSearch(query, items) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return items.filter(item => {
    const fullHaystack = `${item.title} ${item.desc} ${item.tags} ${item.topic} ${item.exam}`.toLowerCase();
    return terms.every(t => fullHaystack.includes(t));
  }).slice(0, 15);
}

export function initSearchModal() {
  const openBtns = document.querySelectorAll('.open-search-modal');
  const backdrop = document.querySelector('.search-modal-backdrop');
  const input = document.querySelector('.search-modal-input');
  const resultsContainer = document.querySelector('.search-results-list');
  const closeBtn = document.querySelector('.search-modal-close');

  if (!backdrop) return;

  function openModal() {
    backdrop.classList.add('is-open');
    if (input) {
      input.value = '';
      input.focus();
    }
    if (resultsContainer) {
      resultsContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: var(--fs-sm);">Type to search grammar rules, books, articles, or exam traps...</div>';
    }
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal();
    }
  });

  let debounceTimer;
  if (input && resultsContainer) {
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const query = input.value.trim();
        if (query.length < 2) {
          resultsContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: var(--fs-sm);">Type at least 2 characters...</div>';
          return;
        }

        trackSearchQuery(query);
        const index = await getSearchIndex();
        const matches = performSearch(query, index);

        if (matches.length === 0) {
          resultsContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No results found for "<strong>${escapeHtml(query)}</strong>". Try searching for <em>Subject-Verb Agreement</em>, <em>Prepositions</em>, or <em>Tenses</em>.</div>`;
          return;
        }

        resultsContainer.innerHTML = matches.map(item => `
          <a href="${item.url}" class="search-result-item">
            <div>
              <div class="item-title">${escapeHtml(item.title)}</div>
              <div style="font-size: var(--fs-xs); color: var(--text-secondary);">${escapeHtml(item.desc.slice(0, 85))}...</div>
            </div>
            <span class="badge ${item.type === 'Grammar eBook' ? 'badge-primary' : 'badge-exam'}">${escapeHtml(item.type)}</span>
          </a>
        `).join('');
      }, 200);
    });
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSearchModal);
}
