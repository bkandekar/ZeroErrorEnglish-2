// Blog Scheduler Management Module
export async function initBlogScheduler() {
  const container = document.getElementById('scheduled-posts-table-body');
  if (!container) return;

  container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Loading scheduled posts...</td></tr>';

  try {
    const res = await fetch('/api/posts/all');
    const posts = await res.json();
    const scheduled = posts.filter(p => p.status === 'scheduled');

    const badge = document.getElementById('scheduled-count-badge');
    if (badge) badge.textContent = `${scheduled.length} Scheduled`;

    if (scheduled.length === 0) {
      container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No posts currently scheduled. All posts are either published or drafts.</td></tr>';
      return;
    }

    container.innerHTML = scheduled.map(post => {
      const scheduledTime = post.scheduledAt ? new Date(post.scheduledAt) : null;
      const formattedTime = scheduledTime ? scheduledTime.toLocaleString() : 'Not set';
      const countdown = getCountdown(scheduledTime);

      return `
        <tr>
          <td>
            <strong>${escapeHtml(post.title)}</strong>
            <div style="font-size: var(--fs-xs); color: var(--text-muted);">${escapeHtml(post.slug)}</div>
          </td>
          <td><span class="badge badge-primary">${escapeHtml(post.grammarTopic || 'Grammar')}</span></td>
          <td>
            <div>${formattedTime}</div>
            <div style="font-size: var(--fs-xs); color: var(--primary); font-weight: var(--fw-semibold);">${countdown}</div>
          </td>
          <td><span class="badge badge-exam">Scheduled</span></td>
          <td>
            <div style="display: flex; gap: var(--space-2);">
              <button class="btn btn-secondary btn-xs btn-publish-now" data-slug="${post.slug}">Publish Now</button>
              <a href="/admin/create-post.html?slug=${post.slug}" class="btn btn-outline btn-xs">Edit</a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Bind Publish Now buttons
    container.querySelectorAll('.btn-publish-now').forEach(btn => {
      btn.addEventListener('click', async () => {
        const slug = btn.getAttribute('data-slug');
        if (!confirm(`Are you sure you want to publish "${slug}" immediately?`)) return;

        btn.disabled = true;
        btn.textContent = 'Publishing...';

        try {
          const pubRes = await fetch(`/api/posts/publish-now/${slug}`, { method: 'POST' });
          if (!pubRes.ok) throw new Error('Publish failed');
          alert('Article published successfully!');
          initBlogScheduler();
        } catch (err) {
          alert(`Error: ${err.message}`);
          btn.disabled = false;
          btn.textContent = 'Publish Now';
        }
      });
    });

  } catch (err) {
    console.error('Failed to load scheduler', err);
    container.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--accent-red);">Error loading scheduled posts.</td></tr>';
  }
}

function getCountdown(targetDate) {
  if (!targetDate) return '';
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return 'Ready to auto-publish';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `in ${hours}h ${mins}m`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initBlogScheduler);
}
