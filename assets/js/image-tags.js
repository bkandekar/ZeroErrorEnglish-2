// Image Tags Management Module
export async function initImageTagsManager() {
  const selectBook = document.getElementById('tag-manager-book-select');
  const tagsContainer = document.getElementById('tag-manager-tags-list');
  const addTagInput = document.getElementById('tag-manager-new-tag');
  const addTagBtn = document.getElementById('tag-manager-add-btn');
  const saveBtn = document.getElementById('tag-manager-save-btn');

  if (!selectBook) return;

  let currentBookSlug = '';
  let currentTags = [];
  let booksList = [];

  try {
    const res = await fetch('/api/books');
    booksList = await res.json();

    selectBook.innerHTML = '<option value="">-- Select a Grammar eBook --</option>' +
      booksList.map(b => `<option value="${b.slug}">${escapeHtml(b.title)}</option>`).join('');

    selectBook.addEventListener('change', () => {
      currentBookSlug = selectBook.value;
      if (!currentBookSlug) {
        currentTags = [];
        renderTags();
        return;
      }

      const book = booksList.find(b => b.slug === currentBookSlug);
      if (book) {
        currentTags = Array.isArray(book.imageTags) ? [...book.imageTags] : (book.imageTags || '').split(',').map(t => t.trim()).filter(Boolean);
        renderTags();
      }
    });

  } catch (err) {
    console.error('Failed to load books for tag manager', err);
  }

  function renderTags() {
    if (!tagsContainer) return;

    if (!currentBookSlug) {
      tagsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: var(--fs-sm);">Select a book above to view and edit its image &amp; topic tags.</div>';
      return;
    }

    if (currentTags.length === 0) {
      tagsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: var(--fs-sm);">No tags assigned yet. Add one below.</div>';
      return;
    }

    tagsContainer.innerHTML = currentTags.map((tag, idx) => `
      <span class="tag-editable-pill">
        <span>${escapeHtml(tag)}</span>
        <span class="tag-remove-btn" data-idx="${idx}" title="Remove tag">✕</span>
      </span>
    `).join('');

    tagsContainer.querySelectorAll('.tag-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        currentTags.splice(idx, 1);
        renderTags();
      });
    });
  }

  if (addTagBtn && addTagInput) {
    function addTag() {
      const val = addTagInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      if (val && !currentTags.includes(val)) {
        currentTags.push(val);
        addTagInput.value = '';
        renderTags();
      }
    }

    addTagBtn.addEventListener('click', addTag);
    addTagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!currentBookSlug) {
        alert('Please select a book first.');
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving Tags...';

      try {
        const res = await fetch('/api/books/update-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: currentBookSlug, tags: currentTags })
        });

        if (!res.ok) throw new Error('Failed to update tags');
        alert('Image and topic tags updated successfully!');
      } catch (err) {
        alert(`Error: ${err.message}`);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Tags to Book File';
      }
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
  document.addEventListener('DOMContentLoaded', initImageTagsManager);
}
