// Books & eBooks Management Module
import { trackAmazonClick } from './analytics.js';

let allBooks = [];

export async function initBooksCatalog() {
  const container = document.getElementById('books-grid');
  if (!container) return;

  container.innerHTML = '<div style="padding: 3rem; text-align: center; color: var(--text-muted);">Loading 14 English Grammar eBooks...</div>';

  try {
    const res = await fetch('/api/books');
    allBooks = await res.json();
    renderBooksGrid(allBooks);
    initBookFilters();
  } catch (err) {
    console.error('Failed to load books', err);
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--accent-red);">Failed to load grammar books.</div>';
  }
}

export function renderBooksGrid(books) {
  const container = document.getElementById('books-grid');
  if (!container) return;

  if (books.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; padding: 3rem; text-align: center;">No grammar books match the chosen filter.</div>';
    return;
  }

  container.innerHTML = books.map(book => {
    const tags = Array.isArray(book.imageTags) ? book.imageTags : (book.imageTags || '').split(',').map(t => t.trim()).filter(Boolean);
    return `
      <div class="book-card" id="book-card-${book.slug}">
        <div class="book-card-cover-wrap">
          <span class="badge badge-primary book-badge-difficulty">${escapeHtml(book.difficulty || 'Intermediate')}</span>
          <img src="${book.coverImage || '/assets/images/books/default.webp'}" alt="${escapeHtml(book.coverImageAlt || book.title)}" class="book-card-cover" loading="lazy" />
        </div>
        <div class="book-card-body">
          <div class="book-card-topic">${escapeHtml(book.topic || 'English Grammar')}</div>
          <h2 class="book-card-title">${escapeHtml(book.title)}</h2>
          <p class="book-card-benefit">${escapeHtml(book.keyBenefits || book.description || '')}</p>
          <div class="book-card-audience">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Target: ${escapeHtml(book.targetAudience || 'Competitive Exams & Students')}</span>
          </div>
          ${tags.length > 0 ? `
            <div class="book-tags-list" style="margin-bottom: var(--space-4);">
              ${tags.slice(0, 3).map(t => `<span class="book-tag-chip">${escapeHtml(t)}</span>`).join('')}
            </div>
          ` : ''}
          <div class="book-card-actions">
            <a href="/pages/book-details.html?slug=${book.slug}" class="btn btn-secondary btn-sm">Explore Book</a>
            <a href="${book.amazonUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-amazon btn-sm" data-amazon-book="${book.id || book.slug}" data-book-title="${escapeHtml(book.title)}">Buy on Amazon</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initBookFilters() {
  const searchInput = document.getElementById('books-search-input');
  const topicFilter = document.getElementById('books-topic-filter');
  const diffFilter = document.getElementById('books-diff-filter');

  function applyFilters() {
    const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const topic = topicFilter ? topicFilter.value : 'all';
    const diff = diffFilter ? diffFilter.value : 'all';

    const filtered = allBooks.filter(b => {
      const matchQ = !q || b.title.toLowerCase().includes(q) || (b.topic || '').toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q);
      const matchTopic = topic === 'all' || (b.topic || '').toLowerCase() === topic.toLowerCase();
      const matchDiff = diff === 'all' || (b.difficulty || '').toLowerCase() === diff.toLowerCase();
      return matchQ && matchTopic && matchDiff;
    });

    renderBooksGrid(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (topicFilter) topicFilter.addEventListener('change', applyFilters);
  if (diffFilter) diffFilter.addEventListener('change', applyFilters);
}

// Individual Book Details Page Renderer
export async function loadAndRenderBookDetails() {
  const container = document.getElementById('book-details-root');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    container.innerHTML = `
      <div style="padding: 4rem; text-align: center;">
        <h2>Book Not Found</h2>
        <p style="margin: 1rem 0;">Please select a book from our 14 Grammar Guides catalogue.</p>
        <a href="/pages/books.html" class="btn btn-primary">Browse All 14 Books</a>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(`/api/books/${slug}`);
    if (!res.ok) throw new Error('Book not found');
    const data = await res.json();
    const meta = data.metadata;
    const rawHtml = data.rawHtml;

    document.title = `${meta.title} | ZeroErrorEnglish Grammar Guides`;

    // Extract HTML body after metadata
    const bodyMatch = rawHtml.match(/<!-- \/METADATA -->([\s\S]*)/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : '';

    const tags = Array.isArray(meta.imageTags) ? meta.imageTags : (meta.imageTags || '').split(',').map(t => t.trim()).filter(Boolean);

    container.innerHTML = `
      <section class="book-hero">
        <div class="container">
          <nav class="breadcrumbs">
            <a href="/">Home</a>
            <span class="separator">/</span>
            <a href="/pages/books.html">Books</a>
            <span class="separator">/</span>
            <span>${escapeHtml(meta.title)}</span>
          </nav>
          <div class="book-hero-grid">
            <div class="book-cover-large-wrap">
              <img src="${meta.coverImage || '/assets/images/books/default.webp'}" alt="${escapeHtml(meta.coverImageAlt || meta.title)}" class="book-cover-large" />
              <div style="width: 100%; display: flex; flex-direction: column; gap: var(--space-3);">
                <a href="${meta.amazonUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-amazon btn-lg" style="width: 100%;" data-amazon-book="${meta.id || meta.slug}" data-book-title="${escapeHtml(meta.title)}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Buy on Amazon KDP
                </a>
                <a href="#sample-questions" class="btn btn-secondary btn-sm" style="width: 100%;">View Sample Traps & Rules</a>
              </div>
            </div>
            <div class="book-hero-info">
              <div class="book-hero-meta-row">
                <span class="badge badge-primary">${escapeHtml(meta.topic || 'English Grammar')}</span>
                <span class="badge badge-exam">${escapeHtml(meta.difficulty || 'Intermediate')}</span>
                <span class="badge badge-exam">Kindle Edition & Paperback</span>
              </div>
              <h1 class="book-hero-title">${escapeHtml(meta.title)}</h1>
              <p class="book-hero-subtitle">${escapeHtml(meta.description || meta.keyBenefits || '')}</p>
              
              <div style="padding: var(--space-4); background-color: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color); margin: var(--space-2) 0;">
                <div style="font-size: var(--fs-xs); font-weight: var(--fw-bold); text-transform: uppercase; color: var(--text-muted); margin-bottom: var(--space-1);">Ideal Audience</div>
                <div style="font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--text-primary);">${escapeHtml(meta.targetAudience || 'SSC CGL, Banking, Railway, NDA, CDS, 12th Grade & Competitive Exam Aspirants')}</div>
              </div>

              ${tags.length > 0 ? `
                <div>
                  <div style="font-size: var(--fs-xs); font-weight: var(--fw-bold); color: var(--text-muted); margin-bottom: var(--space-2); text-transform: uppercase;">Topic &amp; Image Tags:</div>
                  <div class="book-tags-list">
                    ${tags.map(t => `<a href="/pages/books.html?search=${encodeURIComponent(t)}" class="book-tag-chip">${escapeHtml(t)}</a>`).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Content Body rendered directly -->
              <div class="book-content-body" style="margin-top: var(--space-6);">
                ${bodyHtml}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sticky Mobile Buy CTA -->
      <div class="sticky-mobile-cta">
        <div>
          <div style="font-size: var(--fs-xs); font-weight: var(--fw-bold);">${escapeHtml(meta.title.slice(0, 30))}...</div>
          <div style="font-size: 11px; color: var(--text-muted);">Amazon KDP eBook</div>
        </div>
        <a href="${meta.amazonUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-amazon btn-sm" data-amazon-book="${meta.id || meta.slug}" data-book-title="${escapeHtml(meta.title)}">Buy on Amazon</a>
      </div>
    `;
  } catch (err) {
    console.error('Error rendering book details', err);
    container.innerHTML = '<div style="padding: 3rem; text-align: center; color: var(--accent-red);">Unable to load book details.</div>';
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initBooksCatalog();
    loadAndRenderBookDetails();
  });
}
