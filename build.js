import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const GENERATED_DIR = path.join(ROOT_DIR, 'generated');

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// Helper to extract metadata from HTML content
export function extractMetadata(htmlContent, prefix) {
  const metaRegex = new RegExp(`<meta\\s+name=["']${prefix}:([^"']+)["']\\s+content=["'](.*?)["']\\s*\\/?>`, 'gi');
  const metadata = {};
  let match;
  while ((match = metaRegex.exec(htmlContent)) !== null) {
    const key = match[1];
    let val = match[2];
    // Handle comma-separated lists or JSON arrays
    if (['tags', 'secondaryKeywords', 'relatedBooks', 'relatedArticles', 'relatedTopics', 'practiceQuestions', 'topicsCovered', 'keyBenefits', 'imageTags', 'targetExam'].includes(key)) {
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          metadata[key] = JSON.parse(val);
        } catch {
          metadata[key] = val.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else {
        metadata[key] = val.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else {
      metadata[key] = val;
    }
  }
  return metadata;
}

// Auto-publish scheduled posts
export function checkScheduledPosts() {
  const postsDir = path.join(CONTENT_DIR, 'posts');
  if (!fs.existsSync(postsDir)) return;

  const now = new Date();
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = extractMetadata(content, 'post');

    if (meta.status === 'scheduled' && meta.scheduledAt) {
      const scheduledDate = new Date(meta.scheduledAt);
      if (now >= scheduledDate) {
        console.log(`[Auto-Publish] Publishing post: ${meta.title || file}`);
        let updatedContent = content.replace(
          /<meta\s+name=["']post:status["']\s+content=["'][^"']*["']\s*\/?>/i,
          '<meta name="post:status" content="published" />'
        );
        if (!meta.publishDate) {
          updatedContent = updatedContent.replace(
            /<meta\s+name=["']post:publishDate["']\s+content=["'][^"']*["']\s*\/?>/i,
            `<meta name="post:publishDate" content="${now.toISOString()}" />`
          );
        }
        updatedContent = updatedContent.replace(
          /<meta\s+name=["']post:updatedAt["']\s+content=["'][^"']*["']\s*\/?>/i,
          `<meta name="post:updatedAt" content="${now.toISOString()}" />`
        );
        fs.writeFileSync(filePath, updatedContent, 'utf-8');
      }
    }
  });
}

// Build all indexes
export function buildIndexes() {
  console.log('[Build] Scanning content files and building indexes...');
  checkScheduledPosts();

  // 1. Posts
  const postsDir = path.join(CONTENT_DIR, 'posts');
  const posts = [];
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));
    postFiles.forEach(file => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMetadata(content, 'post');
      meta.filename = file;
      if (!meta.slug) meta.slug = file.replace(/\.html$/, '');
      posts.push(meta);
    });
  }
  // Sort published posts by publishDate descending
  posts.sort((a, b) => {
    const dateA = new Date(a.publishDate || a.createdAt || 0);
    const dateB = new Date(b.publishDate || b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
  fs.writeFileSync(path.join(GENERATED_DIR, 'posts-index.json'), JSON.stringify(posts, null, 2), 'utf-8');

  // 2. Books
  const booksDir = path.join(CONTENT_DIR, 'books');
  const books = [];
  if (fs.existsSync(booksDir)) {
    const bookFiles = fs.readdirSync(booksDir).filter(f => f.endsWith('.html'));
    bookFiles.forEach(file => {
      const filePath = path.join(booksDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMetadata(content, 'book');
      meta.filename = file;
      if (!meta.slug) meta.slug = file.replace(/\.html$/, '');
      books.push(meta);
    });
  }
  // Sort books by id or title
  books.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
  fs.writeFileSync(path.join(GENERATED_DIR, 'books-index.json'), JSON.stringify(books, null, 2), 'utf-8');

  // 3. Topics
  const topicsDir = path.join(CONTENT_DIR, 'topics');
  const topics = [];
  if (fs.existsSync(topicsDir)) {
    const topicFiles = fs.readdirSync(topicsDir).filter(f => f.endsWith('.html'));
    topicFiles.forEach(file => {
      const filePath = path.join(topicsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMetadata(content, 'topic');
      meta.filename = file;
      if (!meta.slug) meta.slug = file.replace(/\.html$/, '');
      topics.push(meta);
    });
  }
  fs.writeFileSync(path.join(GENERATED_DIR, 'topics-index.json'), JSON.stringify(topics, null, 2), 'utf-8');

  // 4. Practice Questions
  const practiceDir = path.join(CONTENT_DIR, 'practice');
  const practice = [];
  if (fs.existsSync(practiceDir)) {
    const practiceFiles = fs.readdirSync(practiceDir).filter(f => f.endsWith('.html'));
    practiceFiles.forEach(file => {
      const filePath = path.join(practiceDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMetadata(content, 'practice');
      meta.filename = file;
      practice.push(meta);
    });
  }
  fs.writeFileSync(path.join(GENERATED_DIR, 'practice-index.json'), JSON.stringify(practice, null, 2), 'utf-8');

  // 5. Quizzes
  const quizzesDir = path.join(CONTENT_DIR, 'quizzes');
  const quizzes = [];
  if (fs.existsSync(quizzesDir)) {
    const quizFiles = fs.readdirSync(quizzesDir).filter(f => f.endsWith('.html'));
    quizFiles.forEach(file => {
      const filePath = path.join(quizzesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMetadata(content, 'quiz');
      meta.filename = file;
      quizzes.push(meta);
    });
  }
  fs.writeFileSync(path.join(GENERATED_DIR, 'quizzes-index.json'), JSON.stringify(quizzes, null, 2), 'utf-8');

  // 6. Sitemap XML
  const baseUrl = process.env.APP_URL || 'https://zeroerrorenglish.com';
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  const staticPages = [
    '',
    '/pages/learn-grammar.html',
    '/pages/grammar-topics.html',
    '/pages/blog.html',
    '/pages/practice.html',
    '/pages/quizzes.html',
    '/pages/error-spotting.html',
    '/pages/grammar-shortcuts.html',
    '/pages/books.html',
    '/pages/free-resources.html',
    '/pages/about.html',
    '/pages/contact.html',
    '/pages/search.html',
    '/pages/privacy-policy.html',
    '/pages/terms-and-conditions.html'
  ];

  staticPages.forEach(p => {
    sitemapXml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  posts.filter(p => p.status === 'published').forEach(p => {
    sitemapXml += `  <url>\n    <loc>${baseUrl}/blog/article.html?slug=${p.slug}</loc>\n    <lastmod>${(p.updatedAt || p.publishDate || '').split('T')[0] || '2026-09-01'}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  books.forEach(b => {
    sitemapXml += `  <url>\n    <loc>${baseUrl}/pages/book-details.html?slug=${b.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
  });

  sitemapXml += `</urlset>`;
  fs.writeFileSync(path.join(GENERATED_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  // 7. RSS XML
  let rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n`;
  rssXml += `    <title>ZeroErrorEnglish - English Grammar Mastery &amp; Exam Prep</title>\n`;
  rssXml += `    <link>${baseUrl}</link>\n`;
  rssXml += `    <description>Master English Grammar. Avoid Errors. Ace SSC, Banking, and Competitive Exams.</description>\n`;
  rssXml += `    <language>en-us</language>\n`;

  posts.filter(p => p.status === 'published').slice(0, 20).forEach(p => {
    rssXml += `    <item>\n`;
    rssXml += `      <title><![CDATA[${p.title || ''}]]></title>\n`;
    rssXml += `      <link>${baseUrl}/blog/article.html?slug=${p.slug}</link>\n`;
    rssXml += `      <description><![CDATA[${p.excerpt || ''}]]></description>\n`;
    rssXml += `      <pubDate>${p.publishDate ? new Date(p.publishDate).toUTCString() : new Date().toUTCString()}</pubDate>\n`;
    rssXml += `      <guid>${baseUrl}/blog/article.html?slug=${p.slug}</guid>\n`;
    rssXml += `    </item>\n`;
  });
  rssXml += `  </channel>\n</rss>`;
  fs.writeFileSync(path.join(GENERATED_DIR, 'rss.xml'), rssXml, 'utf-8');

  console.log(`[Build] Generated: ${posts.length} posts (${posts.filter(p=>p.status==='published').length} published, ${posts.filter(p=>p.status==='scheduled').length} scheduled, ${posts.filter(p=>p.status==='draft').length} draft), ${books.length} books, ${topics.length} topics, ${practice.length} practice questions, ${quizzes.length} quizzes.`);
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('build.js')) {
  buildIndexes();
}
