// Blog Listing and Filter Module
let allPosts = [];
let currentCategory = 'all';
let currentExam = 'all';
let currentDifficulty = 'all';

export async function initBlogListing() {
  const container = document.getElementById('blog-posts-grid');
  if (!container) return;

  container.innerHTML = '<div style="padding: 3rem; text-align: center; color: var(--text-muted);">Loading English grammar articles...</div>';

  try {
    const res = await fetch('/api/posts');
    allPosts = await res.json();
    renderFilteredPosts();
    initBlogFilters();
  } catch (err) {
    console.error('Failed to load posts', err);
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--accent-red);">Failed to load articles.</div>';
  }
}

export function renderFilteredPosts() {
  const container = document.getElementById('blog-posts-grid');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const topicParam = urlParams.get('topic');
  const examParam = urlParams.get('exam');

  let filtered = allPosts;

  if (topicParam) {
    filtered = filtered.filter(p => (p.grammarTopic || '').toLowerCase() === topicParam.toLowerCase());
  }

  if (examParam && examParam !== 'all') {
    filtered = filtered.filter(p => {
      const exams = Array.isArray(p.targetExam) ? p.targetExam : (p.targetExam || '').split(',');
      return exams.some(e => e.trim().toLowerCase().includes(examParam.toLowerCase()));
    });
  }

  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => (p.category || '').toLowerCase() === currentCategory.toLowerCase());
  }

  if (currentDifficulty !== 'all') {
    filtered = filtered.filter(p => (p.difficulty || '').toLowerCase() === currentDifficulty.toLowerCase());
  }

  const countBadge = document.getElementById('posts-count-badge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} Articles`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <h3 style="font-size: var(--fs-xl); margin-bottom: 0.5rem;">No articles match your criteria</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Try resetting filters or searching for another grammar topic.</p>
        <button class="btn btn-secondary" id="reset-blog-filters-btn">Reset All Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-blog-filters-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    return;
  }

  container.innerHTML = filtered.map(post => `
    <article class="blog-card">
      <div class="blog-card-img-wrap">
        <img src="${post.featuredImage || '/assets/images/blog/default.webp'}" alt="${escapeHtml(post.featuredImageAlt || post.title)}" class="blog-card-img" loading="lazy" />
        <span class="badge badge-exam" style="position: absolute; top: var(--space-3); right: var(--space-3); background: rgba(0,0,0,0.7); color: #FFF; border: none;">
          ${escapeHtml(post.difficulty || 'Intermediate')}
        </span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span class="badge badge-primary">${escapeHtml(post.category || 'Grammar Rules')}</span>
          <span>•</span>
          <span>${post.readingTime || '6'} min read</span>
          ${post.grammarTopic ? `<span>•</span><span style="color: var(--primary);">${escapeHtml(post.grammarTopic)}</span>` : ''}
        </div>
        <h2 class="blog-card-title">
          <a href="/blog/article.html?slug=${post.slug}">${escapeHtml(post.title)}</a>
        </h2>
        <p class="blog-card-excerpt">${escapeHtml(post.excerpt || post.metaDescription || '')}</p>
        <div class="blog-card-footer">
          <span>By ${escapeHtml(post.author || 'ZeroErrorEnglish')}</span>
          <a href="/blog/article.html?slug=${post.slug}" style="font-weight: var(--fw-semibold); color: var(--primary);">Read Lesson →</a>
        </div>
      </div>
    </article>
  `).join('');
}

function initBlogFilters() {
  const categoryChips = document.querySelectorAll('.blog-cat-filter');
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.getAttribute('data-cat') || 'all';
      renderFilteredPosts();
    });
  });

  const diffSelect = document.getElementById('blog-difficulty-filter');
  if (diffSelect) {
    diffSelect.addEventListener('change', (e) => {
      currentDifficulty = e.target.value;
      renderFilteredPosts();
    });
  }
}

function resetFilters() {
  currentCategory = 'all';
  currentExam = 'all';
  currentDifficulty = 'all';
  const chips = document.querySelectorAll('.blog-cat-filter');
  chips.forEach(c => c.classList.remove('active'));
  const allChip = document.querySelector('.blog-cat-filter[data-cat="all"]');
  if (allChip) allChip.classList.add('active');
  const diffSelect = document.getElementById('blog-difficulty-filter');
  if (diffSelect) diffSelect.value = 'all';
  renderFilteredPosts();
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initBlogListing);
}
