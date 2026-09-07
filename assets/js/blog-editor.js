// HTML Blog Editor Module for ZeroErrorEnglish CMS
export function initBlogEditor() {
  const form = document.getElementById('post-editor-form');
  const codeTextarea = document.getElementById('editor-source-code');
  const previewPane = document.getElementById('editor-preview-container');
  const workspace = document.querySelector('.editor-workspace');

  if (!codeTextarea) return;

  // View modes: split, code, preview
  const viewBtns = document.querySelectorAll('.view-tab-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode'); // 'split' | 'code' | 'preview'
      if (workspace) {
        workspace.className = `editor-workspace mode-${mode}`;
      }
    });
  });

  // Live preview update
  function updatePreview() {
    if (previewPane && codeTextarea) {
      previewPane.innerHTML = `
        <div class="article-body">
          ${codeTextarea.value}
        </div>
      `;
    }
  }

  codeTextarea.addEventListener('input', updatePreview);
  updatePreview();

  // Auto-slug from title
  const titleInput = document.getElementById('post-title');
  const slugInput = document.getElementById('post-slug');
  let slugManuallyEdited = false;
  if (slugInput) {
    slugInput.addEventListener('input', () => {
      slugManuallyEdited = true;
    });
  }
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!slugManuallyEdited && !slugInput.disabled) {
        slugInput.value = titleInput.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    });
  }

  // Load existing post if in edit mode (?edit=slug or ?slug=slug)
  const urlParams = new URLSearchParams(window.location.search);
  const editSlug = urlParams.get('edit') || urlParams.get('slug');
  if (editSlug) {
    fetch(`/api/posts/${editSlug}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.metadata) return;
        const m = data.metadata;
        if (titleInput) titleInput.value = m.title || '';
        if (slugInput) {
          slugInput.value = m.slug || editSlug;
          slugManuallyEdited = true;
        }
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el && val !== undefined && val !== null) el.value = val;
        };
        setVal('post-category', m.category);
        setVal('post-topic', m.grammarTopic);
        setVal('post-difficulty', m.difficulty);
        setVal('post-exam', Array.isArray(m.targetExam) ? m.targetExam.join(', ') : m.targetExam);
        setVal('post-author', m.author);
        setVal('post-excerpt', m.excerpt);
        setVal('post-tags', Array.isArray(m.tags) ? m.tags.join(', ') : m.tags);
        setVal('post-reading-time', m.readingTime);
        setVal('post-related-books', Array.isArray(m.relatedBooks) ? m.relatedBooks[0] : m.relatedBooks);
        setVal('post-seo-title', m.seoTitle);
        setVal('post-meta-desc', m.metaDescription);
        setVal('post-featured-image', m.featuredImage);
        setVal('post-featured-alt', m.featuredImageAlt);

        if (m.scheduledAt) {
          setVal('post-scheduled-at', m.scheduledAt);
          const schedRow = document.getElementById('schedule-datetime-row');
          if (schedRow) schedRow.style.display = 'block';
        }

        // Extract body HTML (everything inside <article> or rawHtml minus metadata)
        if (data.rawHtml) {
          const articleMatch = data.rawHtml.match(/<article[\s\S]*?<\/article>/i);
          if (articleMatch) {
            codeTextarea.value = articleMatch[0];
          } else {
            // strip <!-- METADATA --> ... <!-- /METADATA -->
            const cleaned = data.rawHtml.replace(/<!--\s*METADATA\s*-->[\s\S]*?<!--\s*\/METADATA\s*-->/i, '').trim();
            codeTextarea.value = cleaned;
          }
        }
        updatePreview();
      })
      .catch(err => console.error('Failed to load post for editing', err));
  }

  // Quick Block Inserters
  const blockSnippets = {
    'rule-box': `
<div class="edu-rule-box">
  <div class="edu-rule-header">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>Core Rule</span>
  </div>
  <div class="edu-rule-title">Rule Name Here</div>
  <p>State the fundamental grammatical principle clearly here. Explain when it applies and why.</p>
</div>
`,
    'exam-trap': `
<div class="edu-exam-trap">
  <div class="edu-exam-trap-header">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>High-Frequency Exam Trap</span>
  </div>
  <p><strong>Warning:</strong> SSC and Banking question-setters deliberately insert parenthetical phrases (e.g. <em>along with, as well as</em>) to mislead you into picking a plural verb.</p>
</div>
`,
    'remember-box': `
<div class="edu-remember-box">
  <div class="edu-remember-header">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    <span>Memory Shortcut</span>
  </div>
  <p>Always identify the <strong>true subject</strong> by asking <em>Who or what is performing the action?</em>, ignoring prepositional phrases between the subject and the verb.</p>
</div>
`,
    'compare-box': `
<div class="edu-compare-box">
  <div class="compare-col compare-incorrect">
    <div class="compare-label">✕ Common Mistake (Incorrect)</div>
    <div class="compare-sentence">The captain along with his crew were lost at sea.</div>
    <div class="compare-explanation">"Were" is wrong because "along with his crew" is parenthetical; the subject is singular "captain".</div>
  </div>
  <div class="compare-col compare-correct">
    <div class="compare-label">✓ Exam Accurate (Correct)</div>
    <div class="compare-sentence">The captain along with his crew was lost at sea.</div>
    <div class="compare-explanation">Singular subject "captain" agrees with the singular verb "was".</div>
  </div>
</div>
`,
    'practice-box': `
<div class="edu-practice-box">
  <span class="edu-practice-badge">Exam Practice Check</span>
  <div class="edu-practice-question">Either of the two candidates ______ suitable for this prestigious administrative post.</div>
  <div class="edu-practice-options">
    <button type="button" class="edu-option-btn" data-correct="true">A) is</button>
    <button type="button" class="edu-option-btn" data-correct="false">B) are</button>
    <button type="button" class="edu-option-btn" data-correct="false">C) were</button>
    <button type="button" class="edu-option-btn" data-correct="false">D) have been</button>
  </div>
  <div class="edu-practice-feedback" data-explanation="'Either of' strictly takes a singular noun pronoun concept and singular verb 'is'."></div>
</div>
`,
    'book-insight': `
<div class="edu-book-insight">
  <img src="/assets/images/books/sva-cover.webp" alt="Book Cover" class="edu-book-cover-mini" />
  <div class="edu-book-content">
    <div class="edu-book-tag">Author's Comprehensive Guide</div>
    <div class="edu-book-title">Subject-Verb Agreement Mastery Guide</div>
    <div class="edu-book-pitch">Master all 30 foundational and tricky rules with 200+ exam-level solved questions on Amazon KDP.</div>
    <a href="/pages/books.html" class="btn btn-amazon btn-sm">Buy on Amazon</a>
  </div>
</div>
`
  };

  document.querySelectorAll('.quick-block-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const blockKey = btn.getAttribute('data-block');
      const snippet = blockSnippets[blockKey];
      if (snippet) {
        insertAtCursor(codeTextarea, snippet);
        updatePreview();
      }
    });
  });

  // Status and Publishing Actions
  const btnDraft = document.getElementById('save-draft-btn');
  const btnSchedule = document.getElementById('schedule-post-btn');
  const btnPublish = document.getElementById('publish-now-btn');
  const scheduleRow = document.getElementById('schedule-datetime-row');
  const scheduleInput = document.getElementById('post-scheduled-at');

  if (btnSchedule && scheduleRow) {
    scheduleRow.style.display = 'none';
  }

  async function submitPost(status) {
    const title = document.getElementById('post-title').value.trim();
    if (!title) {
      alert('Please provide a post title.');
      return;
    }

    let slug = document.getElementById('post-slug').value.trim();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const category = document.getElementById('post-category').value;
    const grammarTopic = document.getElementById('post-topic').value;
    const difficulty = document.getElementById('post-difficulty').value;
    const targetExam = document.getElementById('post-exam').value;
    const author = document.getElementById('post-author').value.trim() || 'ZeroErrorEnglish Editorial';
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const tags = document.getElementById('post-tags').value.trim();
    const readingTime = document.getElementById('post-reading-time').value.trim() || '6';
    const relatedBooks = document.getElementById('post-related-books').value.trim();
    const seoTitle = document.getElementById('post-seo-title').value.trim() || title;
    const metaDescription = document.getElementById('post-meta-desc').value.trim() || excerpt;
    const featuredImage = document.getElementById('post-featured-image').value.trim() || '/assets/images/blog/default.webp';
    const featuredImageAlt = document.getElementById('post-featured-alt').value.trim() || title;

    let scheduledAt = '';
    if (status === 'scheduled') {
      scheduledAt = scheduleInput ? scheduleInput.value : '';
      if (!scheduledAt) {
        alert('Please specify the date and time for scheduled publishing.');
        if (scheduleRow) scheduleRow.style.display = 'block';
        return;
      }
    }

    const contentHtml = codeTextarea.value;

    const payload = {
      slug,
      title,
      category,
      grammarTopic,
      difficulty,
      targetExam,
      author,
      excerpt,
      tags,
      readingTime,
      relatedBooks,
      seoTitle,
      metaDescription,
      featuredImage,
      featuredImageAlt,
      status,
      scheduledAt,
      contentHtml
    };

    const submitBtn = status === 'published' ? btnPublish : status === 'scheduled' ? btnSchedule : btnDraft;
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) submitBtn.textContent = 'Saving...';

    try {
      const res = await fetch('/api/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');

      alert(`Success: Article "${title}" has been saved with status "${status}"!`);
      window.location.href = '/admin/index.html';
    } catch (err) {
      alert(`Error saving post: ${err.message}`);
    } finally {
      if (submitBtn) submitBtn.textContent = originalText;
    }
  }

  if (btnDraft) btnDraft.addEventListener('click', () => submitPost('draft'));
  if (btnPublish) btnPublish.addEventListener('click', () => submitPost('published'));
  if (btnSchedule) {
    btnSchedule.addEventListener('click', () => {
      if (scheduleRow && scheduleRow.style.display === 'none') {
        scheduleRow.style.display = 'block';
        scheduleInput.focus();
      } else {
        submitPost('scheduled');
      }
    });
  }
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);
  textarea.value = before + text + after;
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  textarea.focus();
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initBlogEditor);
}
