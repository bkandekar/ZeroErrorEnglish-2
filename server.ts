import express from 'express';
import path from 'path';
import fs from 'fs';
import { buildIndexes, checkScheduledPosts, extractMetadata } from './build.js';

const app = express();
const PORT = 3000;
const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const GENERATED_DIR = path.join(ROOT_DIR, 'generated');
const ANALYTICS_FILE = path.join(ROOT_DIR, 'generated', 'analytics-data.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initial build on startup
try {
  buildIndexes();
} catch (err) {
  console.error('[Startup Build Error]:', err);
}

// Scheduled check runner every 30 seconds
setInterval(() => {
  try {
    checkScheduledPosts();
    buildIndexes();
  } catch (err) {
    console.error('[Cron Schedule Check Error]:', err);
  }
}, 30000);

// Analytics storage helper
function getAnalytics() {
  if (fs.existsSync(ANALYTICS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    } catch {
      // return default
    }
  }
  return {
    pageViews: {
      '/': 1420,
      '/pages/learn-grammar.html': 980,
      '/pages/books.html': 1150,
      '/pages/practice.html': 870,
      '/pages/quizzes.html': 760,
      '/pages/error-spotting.html': 640
    },
    articleViews: {
      'subject-verb-agreement-basics': 520,
      'tenses-mastery-exam-guide': 430,
      'top-50-preposition-rules': 390
    },
    bookClicks: {
      'spot-the-error-sva': 184,
      'tense-in-english-grammar': 152,
      'modal-auxiliaries-zero-errors': 128,
      'preposition-english-grammar': 116,
      '100-grammar-shortcuts': 95
    },
    popularTopics: {
      'Subject-Verb Agreement': 890,
      'Tenses': 740,
      'Prepositions': 620,
      'Modal Auxiliaries': 530,
      'Active & Passive Voice': 480
    },
    searchQueries: [
      { query: 'subject verb agreement rules', count: 86 },
      { query: 'either or neither nor rule', count: 64 },
      { query: 'modal verbs exam traps', count: 42 },
      { query: 'preposition error spotting', count: 39 },
      { query: 'question tags exceptions', count: 28 }
    ],
    quizCompletions: 340,
    newsletterSignups: 118,
    events: []
  };
}

function saveAnalytics(data: any) {
  try {
    if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save analytics', err);
  }
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Posts List (Filtering for public vs admin)
app.get('/api/posts', (req, res) => {
  try {
    const indexPath = path.join(GENERATED_DIR, 'posts-index.json');
    if (!fs.existsSync(indexPath)) buildIndexes();
    const posts = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const isAll = req.query.all === 'true';
    const statusFilter = req.query.status as string;

    if (isAll) {
      if (statusFilter) {
        return res.json(posts.filter((p: any) => p.status === statusFilter));
      }
      return res.json(posts);
    }

    // Public view: only published and scheduledAt passed
    const now = new Date();
    const publicPosts = posts.filter((p: any) => {
      if (p.status !== 'published') return false;
      return true;
    });

    res.json(publicPosts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// All Posts Alias (used by admin and scheduler)
app.get(['/api/posts/all', '/api/admin/posts'], (req, res) => {
  try {
    const indexPath = path.join(GENERATED_DIR, 'posts-index.json');
    if (!fs.existsSync(indexPath)) buildIndexes();
    const posts = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Publish Immediately Endpoint (used by scheduler and admin)
app.post(['/api/posts/publish-now/:slug', '/api/admin/schedule/:slug/publish'], (req, res) => {
  try {
    const slug = req.params.slug;
    const filePath = path.join(CONTENT_DIR, 'posts', `${slug}.html`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Post not found' });

    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(
      /<meta\s+name=["']post:status["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="post:status" content="published" />`
    );
    const nowIso = new Date().toISOString();
    content = content.replace(
      /<meta\s+name=["']post:publishDate["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="post:publishDate" content="${nowIso.split('T')[0]}" />`
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    buildIndexes();
    res.json({ success: true, message: `Post "${slug}" published immediately.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reschedule Post
app.post('/api/posts/schedule/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const { scheduledAt } = req.body;
    const filePath = path.join(CONTENT_DIR, 'posts', `${slug}.html`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Post not found' });

    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(
      /<meta\s+name=["']post:status["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="post:status" content="scheduled" />`
    );
    if (content.includes('name="post:scheduledAt"')) {
      content = content.replace(
        /<meta\s+name=["']post:scheduledAt["']\s+content=["'][^"']*["']\s*\/?>/i,
        `<meta name="post:scheduledAt" content="${escapeHtml(scheduledAt)}" />`
      );
    } else {
      content = content.replace(
        '<!-- /METADATA -->',
        `<meta name="post:scheduledAt" content="${escapeHtml(scheduledAt)}" />\n<!-- /METADATA -->`
      );
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    buildIndexes();
    res.json({ success: true, message: `Post "${slug}" scheduled for ${scheduledAt}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single Post HTML
app.get('/api/posts/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const filePath = path.join(CONTENT_DIR, 'posts', `${slug}.html`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const html = fs.readFileSync(filePath, 'utf-8');
    const meta = extractMetadata(html, 'post');
    res.json({ slug, metadata: meta, rawHtml: html });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Save Post (HTML-native: writes directly to content/posts/<slug>.html)
app.post('/api/posts/save', (req, res) => {
  try {
    const {
      slug,
      title,
      excerpt,
      seoTitle,
      metaDescription,
      focusKeyword,
      secondaryKeywords,
      category,
      tags,
      grammarTopic,
      difficulty,
      targetExam,
      readingTime,
      featuredImage,
      featuredImageAlt,
      featuredImageTitle,
      featuredImageCaption,
      relatedBooks,
      relatedArticles,
      relatedTopics,
      practiceQuestions,
      status,
      scheduledAt,
      contentHtml,
      author
    } = req.body;

    if (!slug || !title) {
      return res.status(400).json({ error: 'Title and Slug are required' });
    }

    const postsDir = path.join(CONTENT_DIR, 'posts');
    if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

    const filePath = path.join(postsDir, `${slug}.html`);
    const isNew = !fs.existsSync(filePath);
    const existingContent = !isNew ? fs.readFileSync(filePath, 'utf-8') : '';
    const existingMeta = !isNew ? extractMetadata(existingContent, 'post') : {};

    const now = new Date().toISOString();
    const finalCreatedAt = existingMeta.createdAt || now;
    const finalPublishDate = status === 'published' ? (existingMeta.publishDate || now) : (existingMeta.publishDate || '');

    // Construct the HTML-native file
    const metaTags = [
      `<!-- METADATA -->`,
      `<meta name="post:id" content="${existingMeta.id || 'post-' + Date.now().toString(36)}" />`,
      `<meta name="post:title" content="${escapeHtml(title || '')}" />`,
      `<meta name="post:slug" content="${escapeHtml(slug)}" />`,
      `<meta name="post:excerpt" content="${escapeHtml(excerpt || '')}" />`,
      `<meta name="post:seoTitle" content="${escapeHtml(seoTitle || title || '')}" />`,
      `<meta name="post:metaDescription" content="${escapeHtml(metaDescription || excerpt || '')}" />`,
      `<meta name="post:focusKeyword" content="${escapeHtml(focusKeyword || '')}" />`,
      `<meta name="post:secondaryKeywords" content="${escapeHtml(Array.isArray(secondaryKeywords) ? secondaryKeywords.join(', ') : secondaryKeywords || '')}" />`,
      `<meta name="post:category" content="${escapeHtml(category || 'Grammar Rules')}" />`,
      `<meta name="post:tags" content="${escapeHtml(Array.isArray(tags) ? tags.join(', ') : tags || '')}" />`,
      `<meta name="post:grammarTopic" content="${escapeHtml(grammarTopic || 'General')}" />`,
      `<meta name="post:difficulty" content="${escapeHtml(difficulty || 'Intermediate')}" />`,
      `<meta name="post:targetExam" content="${escapeHtml(Array.isArray(targetExam) ? targetExam.join(', ') : targetExam || 'SSC, Banking')}" />`,
      `<meta name="post:readingTime" content="${readingTime || '6'}" />`,
      `<meta name="post:featuredImage" content="${escapeHtml(featuredImage || '/assets/images/blog/default.webp')}" />`,
      `<meta name="post:featuredImageAlt" content="${escapeHtml(featuredImageAlt || title || '')}" />`,
      `<meta name="post:featuredImageTitle" content="${escapeHtml(featuredImageTitle || title || '')}" />`,
      `<meta name="post:featuredImageCaption" content="${escapeHtml(featuredImageCaption || '')}" />`,
      `<meta name="post:relatedBooks" content="${escapeHtml(Array.isArray(relatedBooks) ? relatedBooks.join(', ') : relatedBooks || '')}" />`,
      `<meta name="post:relatedArticles" content="${escapeHtml(Array.isArray(relatedArticles) ? relatedArticles.join(', ') : relatedArticles || '')}" />`,
      `<meta name="post:relatedTopics" content="${escapeHtml(Array.isArray(relatedTopics) ? relatedTopics.join(', ') : relatedTopics || '')}" />`,
      `<meta name="post:practiceQuestions" content="${escapeHtml(Array.isArray(practiceQuestions) ? practiceQuestions.join(', ') : practiceQuestions || '')}" />`,
      `<meta name="post:author" content="${escapeHtml(author || 'ZeroErrorEnglish Editorial')}" />`,
      `<meta name="post:publishDate" content="${finalPublishDate}" />`,
      `<meta name="post:scheduledAt" content="${scheduledAt || ''}" />`,
      `<meta name="post:status" content="${status || 'draft'}" />`,
      `<meta name="post:createdAt" content="${finalCreatedAt}" />`,
      `<meta name="post:updatedAt" content="${now}" />`,
      `<!-- /METADATA -->`
    ].join('\n');

    let bodyHtml = contentHtml || '<article>\n<h1>' + escapeHtml(title) + '</h1>\n<p>Article content goes here...</p>\n</article>';
    if (!bodyHtml.trim().startsWith('<article>')) {
      bodyHtml = `<article>\n${bodyHtml}\n</article>`;
    }

    const fullFileContent = `${metaTags}\n${bodyHtml}\n`;
    fs.writeFileSync(filePath, fullFileContent, 'utf-8');

    // Trigger build
    buildIndexes();

    res.json({
      success: true,
      message: `Post ${slug} saved successfully`,
      slug,
      status: status || 'draft',
      updatedAt: now
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete or Archive Post
app.delete('/api/posts/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const filePath = path.join(CONTENT_DIR, 'posts', `${slug}.html`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      buildIndexes();
      return res.json({ success: true, message: `Post ${slug} deleted` });
    }
    res.status(404).json({ error: 'Post not found' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Books List
app.get('/api/books', (req, res) => {
  try {
    const indexPath = path.join(GENERATED_DIR, 'books-index.json');
    if (!fs.existsSync(indexPath)) buildIndexes();
    const books = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    res.json(books);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single Book Detail
app.get('/api/books/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const filePath = path.join(CONTENT_DIR, 'books', `${slug}.html`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const html = fs.readFileSync(filePath, 'utf-8');
    const meta = extractMetadata(html, 'book');
    res.json({ slug, metadata: meta, rawHtml: html });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Book Image Tags
app.post('/api/books/update-tags', (req, res) => {
  try {
    const slug = req.body.slug;
    const incomingTags = req.body.imageTags || req.body.tags || '';
    if (!slug) return res.status(400).json({ error: 'Book slug required' });

    const filePath = path.join(CONTENT_DIR, 'books', `${slug}.html`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Book not found' });

    let content = fs.readFileSync(filePath, 'utf-8');
    const tagsString = Array.isArray(incomingTags) ? incomingTags.join(', ') : incomingTags;

    if (content.includes('name="book:imageTags"')) {
      content = content.replace(
        /<meta\s+name=["']book:imageTags["']\s+content=["'][^"']*["']\s*\/?>/i,
        `<meta name="book:imageTags" content="${escapeHtml(tagsString)}" />`
      );
    } else {
      content = content.replace(
        '<!-- /METADATA -->',
        `<meta name="book:imageTags" content="${escapeHtml(tagsString)}" />\n<!-- /METADATA -->`
      );
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    buildIndexes();
    res.json({ success: true, slug, imageTags: tagsString });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Topics List
app.get('/api/topics', (req, res) => {
  try {
    const indexPath = path.join(GENERATED_DIR, 'topics-index.json');
    if (!fs.existsSync(indexPath)) buildIndexes();
    const topics = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    res.json(topics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single Topic Detail
app.get('/api/topics/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const filePath = path.join(CONTENT_DIR, 'topics', `${slug}.html`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    const html = fs.readFileSync(filePath, 'utf-8');
    const meta = extractMetadata(html, 'topic');
    res.json({ slug, metadata: meta, rawHtml: html });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Practice Questions
app.get('/api/practice', (req, res) => {
  try {
    const indexPath = path.join(GENERATED_DIR, 'practice-index.json');
    if (!fs.existsSync(indexPath)) buildIndexes();
    const items = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const topic = req.query.topic as string;
    const type = req.query.type as string;
    let filtered = items;
    if (topic) filtered = filtered.filter((i: any) => i.topic === topic || i.relatedTopic === topic);
    if (type) filtered = filtered.filter((i: any) => i.type === type);
    res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Quizzes
app.get('/api/quizzes', (req, res) => {
  try {
    const indexPath = path.join(GENERATED_DIR, 'quizzes-index.json');
    if (!fs.existsSync(indexPath)) buildIndexes();
    const quizzes = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    res.json(quizzes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Track Analytics Event
app.post('/api/analytics/track', (req, res) => {
  try {
    const { type, page, slug, query, score, bookId } = req.body;
    const analytics = getAnalytics();

    if (type === 'pageview' && page) {
      analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
    } else if (type === 'article_view' && slug) {
      analytics.articleViews[slug] = (analytics.articleViews[slug] || 0) + 1;
    } else if (type === 'amazon_click' && bookId) {
      analytics.bookClicks[bookId] = (analytics.bookClicks[bookId] || 0) + 1;
    } else if (type === 'search' && query) {
      const existing = analytics.searchQueries.find((s: any) => s.query.toLowerCase() === query.toLowerCase());
      if (existing) existing.count += 1;
      else analytics.searchQueries.unshift({ query, count: 1 });
      analytics.searchQueries = analytics.searchQueries.slice(0, 30);
    } else if (type === 'quiz_completed') {
      analytics.quizCompletions = (analytics.quizCompletions || 0) + 1;
    } else if (type === 'newsletter') {
      analytics.newsletterSignups = (analytics.newsletterSignups || 0) + 1;
    }

    analytics.events.push({
      type,
      page,
      slug,
      bookId,
      timestamp: new Date().toISOString()
    });
    // keep recent 100 events
    if (analytics.events.length > 100) analytics.events = analytics.events.slice(-100);

    saveAnalytics(analytics);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics Dashboard Data
app.get('/api/analytics/stats', (req, res) => {
  try {
    const analytics = getAnalytics();
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manual Rebuild
app.post('/api/rebuild', (req, res) => {
  try {
    buildIndexes();
    res.json({ success: true, message: 'Indexes rebuilt successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

function escapeHtml(text: string) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------------- STATIC ASSET & PAGE SERVING ----------------
// Serve root directory and dist directory so /pages, /blog, /admin, /assets, /generated are available
app.use(express.static(ROOT_DIR));
const distPath = path.join(ROOT_DIR, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Homepage fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Blog article clean routing: /blog/:slug -> /blog/article.html?slug=:slug
app.get('/blog/:slug', (req, res, next) => {
  if (req.params.slug.includes('.')) return next();
  res.sendFile(path.join(ROOT_DIR, 'blog', 'article.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ZeroErrorEnglish] Server running at http://0.0.0.0:${PORT}`);
});
