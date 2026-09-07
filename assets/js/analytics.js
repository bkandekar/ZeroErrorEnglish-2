// Analytics & Conversion Tracking Module
export function trackEvent(eventType, payload = {}) {
  try {
    const data = {
      type: eventType,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      ...payload
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {
      // Fallback local storage logging if offline
      const logs = JSON.parse(localStorage.getItem('zeroerror_analytics_cache') || '[]');
      logs.push(data);
      if (logs.length > 50) logs.shift();
      localStorage.setItem('zeroerror_analytics_cache', JSON.stringify(logs));
    });
  } catch (err) {
    console.debug('Analytics error', err);
  }
}

// Helper tracking methods
export function trackPageView() {
  trackEvent('pageview', { page: window.location.pathname });
}

export function trackArticleView(slug) {
  trackEvent('article_view', { slug });
}

export function trackAmazonClick(bookId, bookTitle, amazonUrl) {
  trackEvent('amazon_click', { bookId, bookTitle, amazonUrl });
}

export function trackQuizCompleted(quizId, score, maxScore, weakTopics) {
  trackEvent('quiz_completed', { quizId, score, maxScore, weakTopics });
}

export function trackSearchQuery(query) {
  trackEvent('search', { query });
}

export function trackNewsletter(email) {
  trackEvent('newsletter', { email });
}

// Auto track pageview on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    trackPageView();

    // Global listener for Amazon KDP buttons
    document.addEventListener('click', (e) => {
      const amazonBtn = e.target.closest('a[data-amazon-book]');
      if (amazonBtn) {
        const bookId = amazonBtn.getAttribute('data-amazon-book');
        const bookTitle = amazonBtn.getAttribute('data-book-title') || '';
        const url = amazonBtn.getAttribute('href') || '';
        trackAmazonClick(bookId, bookTitle, url);
      }
    });
  });
}
