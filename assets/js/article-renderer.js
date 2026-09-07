// Article Renderer Module
import { trackArticleView } from './analytics.js';

export async function loadAndRenderArticle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug') || window.location.pathname.split('/').pop().replace('.html', '');

  if (!slug || slug === 'article') {
    renderArticleError('No article specified. Please select an article from the Blog.');
    return;
  }

  try {
    const res = await fetch(`/api/posts/${slug}`);
    if (!res.ok) throw new Error('Article not found');
    const data = await res.json();
    const meta = data.metadata;
    const rawHtml = data.rawHtml;

    // Track view
    trackArticleView(slug);

    // Set Document Title and Meta
    document.title = `${meta.seoTitle || meta.title} | ZeroErrorEnglish`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && (meta.metaDescription || meta.excerpt)) {
      metaDesc.setAttribute('content', meta.metaDescription || meta.excerpt);
    }

    // Extract <article>...</article> body
    const articleMatch = rawHtml.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
    const articleBodyHtml = articleMatch ? articleMatch[1] : '<p>Content missing.</p>';

    // Render Article Header
    const headerContainer = document.getElementById('article-header-container');
    if (headerContainer) {
      headerContainer.innerHTML = `
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span class="separator">/</span>
          <a href="/pages/blog.html">Blog</a>
          <span class="separator">/</span>
          <a href="/pages/grammar-topics.html?topic=${encodeURIComponent(meta.grammarTopic || '')}">${escapeHtml(meta.grammarTopic || 'Grammar')}</a>
          <span class="separator">/</span>
          <span>${escapeHtml(meta.title)}</span>
        </nav>
        <div class="article-meta-top">
          <span class="badge badge-primary">${escapeHtml(meta.category || 'Grammar Rules')}</span>
          <span class="badge badge-exam">${escapeHtml(Array.isArray(meta.targetExam) ? meta.targetExam.join(', ') : (meta.targetExam || 'Competitive Exams'))}</span>
          <span class="badge badge-exam">${escapeHtml(meta.difficulty || 'Intermediate')}</span>
        </div>
        <h1 class="article-title">${escapeHtml(meta.title)}</h1>
        ${meta.excerpt ? `<p class="article-lead">${escapeHtml(meta.excerpt)}</p>` : ''}
        <div class="article-meta-details">
          <div class="article-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>By <strong>${escapeHtml(meta.author || 'ZeroErrorEnglish Editorial')}</strong></span>
          </div>
          <div class="article-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Published: ${formatDate(meta.publishDate)}</span>
          </div>
          ${meta.updatedAt && meta.updatedAt !== meta.publishDate ? `
            <div class="article-meta-item">
              <span>(Updated: ${formatDate(meta.updatedAt)})</span>
            </div>
          ` : ''}
          <div class="article-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${meta.readingTime || '6'} min read</span>
          </div>
        </div>
      `;
    }

    // Render Article Body
    const bodyContainer = document.getElementById('article-body-container');
    if (bodyContainer) {
      bodyContainer.innerHTML = articleBodyHtml;

      // Inject IDs into headings for TOC and build TOC
      generateTOC(bodyContainer);

      // Activate in-article interactive options
      bindInteractivePractice(bodyContainer);
    }

    // Render Contextual Book Recommendation at bottom of article
    renderContextualBook(meta.relatedBooks || meta.grammarTopic);

  } catch (err) {
    console.error('Failed to load article', err);
    renderArticleError('Unable to load this grammar article. It may still be scheduled or unpublished.');
  }
}

function generateTOC(container) {
  const headings = container.querySelectorAll('h2, h3');
  const tocList = document.getElementById('toc-list');
  const tocContainer = document.getElementById('article-toc-box');

  if (!tocList || headings.length < 2) {
    if (tocContainer) tocContainer.style.display = 'none';
    return;
  }

  tocList.innerHTML = '';
  headings.forEach((heading, idx) => {
    let id = heading.id;
    if (!id) {
      id = heading.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `section-${idx + 1}`;
      heading.id = id;
    }

    const li = document.createElement('li');
    const isH3 = heading.tagName.toLowerCase() === 'h3';
    li.innerHTML = `
      <a href="#${id}" class="toc-link ${isH3 ? 'indent-1' : ''}">${escapeHtml(heading.textContent)}</a>
    `;
    tocList.appendChild(li);
  });
}

function bindInteractivePractice(container) {
  const practiceBoxes = container.querySelectorAll('.edu-practice-box');
  practiceBoxes.forEach(box => {
    const options = box.querySelectorAll('.edu-option-btn');
    const feedback = box.querySelector('.edu-practice-feedback');

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        options.forEach(o => {
          o.disabled = true;
          if (o.getAttribute('data-correct') === 'true') {
            o.classList.add('selected-correct');
          }
        });
        if (!isCorrect) {
          btn.classList.add('selected-wrong');
        }
        if (feedback) {
          feedback.style.display = 'block';
          feedback.innerHTML = isCorrect
            ? `<div class="badge badge-success" style="margin-bottom: 0.5rem;">✓ Correct Answer!</div><p>${feedback.getAttribute('data-explanation') || 'Well done! You identified the correct rule.'}</p>`
            : `<div class="badge badge-danger" style="margin-bottom: 0.5rem;">✕ Incorrect!</div><p>${feedback.getAttribute('data-explanation') || 'Look closely at the grammar rule and subject agreement.'}</p>`;
        }
      });
    });
  });
}

async function renderContextualBook(bookReference) {
  const container = document.getElementById('related-book-container');
  if (!container) return;

  try {
    const booksRes = await fetch('/api/books').then(r => r.json());
    let book = null;

    if (Array.isArray(bookReference)) bookReference = bookReference[0];

    if (bookReference) {
      book = booksRes.find(b => b.slug === bookReference || b.id === bookReference || (b.topic && b.topic.toLowerCase().includes(String(bookReference).toLowerCase())));
    }
    if (!book && booksRes.length > 0) {
      book = booksRes[0];
    }

    if (!book) return;

    container.innerHTML = `
      <div class="edu-book-insight">
        <img src="${book.coverImage || '/assets/images/books/sva-cover.webp'}" alt="${escapeHtml(book.coverImageAlt || book.title)}" class="edu-book-cover-mini" />
        <div class="edu-book-content">
          <div class="edu-book-tag">Author's Recommended Study Guide</div>
          <div class="edu-book-title">${escapeHtml(book.title)}</div>
          <div class="edu-book-pitch">${escapeHtml(book.keyBenefits || book.description || 'Master all rules, exceptions, and 200+ exam-level error spotting questions.')}</div>
          <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
            <a href="/pages/book-details.html?slug=${book.slug}" class="btn btn-secondary btn-sm">Explore Book Details</a>
            <a href="${book.amazonUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-amazon btn-sm" data-amazon-book="${book.id || book.slug}" data-book-title="${escapeHtml(book.title)}">Buy on Amazon</a>
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    console.error('Error rendering related book', e);
  }
}

function renderArticleError(msg) {
  const body = document.getElementById('article-body-container');
  if (body) {
    body.innerHTML = `
      <div style="padding: 3rem 1.5rem; text-align: center;">
        <h2 style="font-size: var(--fs-2xl); color: var(--accent-red); margin-bottom: 1rem;">Article Unavailable</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${escapeHtml(msg)}</p>
        <a href="/pages/blog.html" class="btn btn-primary">Browse All Published Articles</a>
      </div>
    `;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return 'Recently published';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', loadAndRenderArticle);
}
