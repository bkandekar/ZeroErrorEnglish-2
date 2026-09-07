// Image & eBook Asset Manager Module
export async function initImageManager() {
  const container = document.getElementById('image-gallery-grid');
  if (!container) return;

  try {
    const res = await fetch('/api/books');
    const books = await res.json();

    container.innerHTML = books.map(book => `
      <div class="stat-card" style="display: flex; flex-direction: column; gap: var(--space-3);">
        <div style="height: 180px; background: var(--bg-secondary); border-radius: var(--radius-md); overflow: hidden; display: flex; align-items: center; justify-content: center;">
          <img src="${book.coverImage || '/assets/images/books/default.webp'}" alt="${escapeHtml(book.coverImageAlt || book.title)}" style="max-height: 160px; object-fit: contain; box-shadow: var(--shadow-sm);" />
        </div>
        <div>
          <div style="font-size: var(--fs-xs); font-weight: var(--fw-bold); color: var(--primary); text-transform: uppercase;">eBook Cover</div>
          <div style="font-size: var(--fs-sm); font-weight: var(--fw-bold); color: var(--text-primary);">${escapeHtml(book.title)}</div>
          <div style="font-size: var(--fs-xs); color: var(--text-muted); word-break: break-all; margin-top: 4px;"><code>${book.coverImage || '/assets/images/books/default.webp'}</code></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${(Array.isArray(book.imageTags) ? book.imageTags : []).map(t => `<span class="badge badge-exam" style="font-size: 10px;">${escapeHtml(t)}</span>`).join('')}
        </div>
        <button class="btn btn-secondary btn-xs copy-path-btn" data-path="${book.coverImage || ''}" style="margin-top: auto;">
          Copy Image Path
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.copy-path-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-path');
        navigator.clipboard.writeText(p).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy Image Path'; }, 1500);
        });
      });
    });

  } catch (err) {
    console.error('Failed to load image manager', err);
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initImageManager);
}
