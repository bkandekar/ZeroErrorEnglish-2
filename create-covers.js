// Script to generate beautiful SVG book covers and blog illustrations
import fs from 'fs';
import path from 'path';

const booksDir = path.join(process.cwd(), 'assets/images/books');
const blogDir = path.join(process.cwd(), 'assets/images/blog');

fs.mkdirSync(booksDir, { recursive: true });
fs.mkdirSync(blogDir, { recursive: true });

const bookCovers = [
  { file: 'sva-cover.webp', title: 'Subject-Verb Agreement', sub: 'The Master Guide to 30 Rules & Exam Traps', color: '#1E3A8A', accent: '#3B82F6' },
  { file: 'tenses-cover.webp', title: 'Tenses Decoded', sub: 'Master Past, Present & Future Structures', color: '#065F46', accent: '#10B981' },
  { file: 'prepositions-cover.webp', title: 'Prepositions Simplified', sub: 'Fixed Prepositions & 100+ Exam Confusions', color: '#7C2D12', accent: '#F97316' },
  { file: 'modals-cover.webp', title: 'Modal Auxiliaries in Action', sub: 'Usage, Nuances & Error Elimination', color: '#4C1D95', accent: '#8B5CF6' },
  { file: 'voice-cover.webp', title: 'Active & Passive Voice', sub: 'Complete Transformation Mastery', color: '#1E293B', accent: '#38BDF8' },
  { file: 'speech-cover.webp', title: 'Direct & Indirect Speech', sub: 'Narration Rules for All Tenses & Modals', color: '#831843', accent: '#EC4899' },
  { file: 'articles-cover.webp', title: 'Articles: A, An, The', sub: 'Zero Error Guide with High-Frequency Traps', color: '#14532D', accent: '#22C55E' },
  { file: 'tags-cover.webp', title: 'Question Tags Perfected', sub: 'Rules, Irregular Exceptions & 150+ Questions', color: '#701A75', accent: '#D946EF' },
  { file: 'conditional-cover.webp', title: 'Conditional Sentences', sub: 'Master Zero, First, Second & Third Conditionals', color: '#1E3A8A', accent: '#60A5FA' },
  { file: 'gerund-cover.webp', title: 'Gerunds, Infinitives & Participles', sub: 'Non-Finite Verbs Demystified', color: '#312E81', accent: '#6366F1' },
  { file: 'conjunctions-cover.webp', title: 'Conjunctions & Connectors', sub: 'Sentence Cohesion & Correlative Pairs', color: '#164E63', accent: '#06B6D4' },
  { file: 'error-spotting-cover.webp', title: '500+ Error Spotting Questions', sub: 'Comprehensive Exam-Level Practice Handbook', color: '#881337', accent: '#F43F5E' },
  { file: 'sentence-imp-cover.webp', title: 'Sentence Improvement Handbook', sub: 'Replace & Refine for Maximum Exam Marks', color: '#713F12', accent: '#EAB308' },
  { file: 'shortcuts-cover.webp', title: 'English Grammar Shortcuts', sub: 'Quick Formulae & Mnemonics for Competitive Exams', color: '#0F172A', accent: '#F59E0B' },
  { file: 'default.webp', title: 'ZeroError English Grammar', sub: 'Amazon KDP Best-Selling Series', color: '#18181B', accent: '#2563EB' }
];

function generateBookSvg(title, sub, bg, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 460" width="320" height="460">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="#09090B" />
    </linearGradient>
    <linearGradient id="spine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="320" height="460" rx="6" fill="url(#bgGrad)"/>
  <!-- Spine shadow -->
  <rect width="18" height="460" fill="url(#spine)"/>
  <!-- Inner border -->
  <rect x="24" y="24" width="272" height="412" rx="4" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.4"/>
  <!-- Series Badge -->
  <rect x="40" y="44" width="160" height="22" rx="3" fill="${accent}" fill-opacity="0.2"/>
  <text x="48" y="59" fill="${accent}" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" letter-spacing="1">ZEROERROR ENGLISH</text>
  <!-- Title -->
  <text x="40" y="140" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="24" font-weight="800" width="240">
    ${splitText(title, 18).map((line, i) => `<tspan x="40" dy="${i === 0 ? 0 : 30}">${escapeXml(line)}</tspan>`).join('')}
  </text>
  <!-- Subtitle -->
  <text x="40" y="270" fill="#A1A1AA" font-family="system-ui, sans-serif" font-size="12" font-weight="500">
    ${splitText(sub, 30).map((line, i) => `<tspan x="40" dy="${i === 0 ? 0 : 18}">${escapeXml(line)}</tspan>`).join('')}
  </text>
  <!-- Exam tags -->
  <rect x="40" y="340" width="240" height="28" rx="4" fill="#27272A" stroke="#3F3F46" stroke-width="1"/>
  <text x="50" y="358" fill="#F4F4F5" font-family="system-ui, sans-serif" font-size="10" font-weight="600">SSC • BANKING • CDS • ACADEMICS</text>
  <!-- Author footer -->
  <line x1="40" y1="390" x2="280" y2="390" stroke="${accent}" stroke-width="1" stroke-opacity="0.5"/>
  <text x="40" y="415" fill="#E4E4E7" font-family="system-ui, sans-serif" font-size="12" font-weight="700">AUTHORITATIVE KDP GUIDE</text>
  <text x="235" y="415" fill="${accent}" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">KINDLE</text>
</svg>`;
}

function splitText(str, maxChars) {
  const words = str.split(' ');
  const lines = [];
  let current = '';
  words.forEach(w => {
    if ((current + ' ' + w).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = w;
    } else {
      current += ' ' + w;
    }
  });
  if (current) lines.push(current.trim());
  return lines;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Generate book covers
bookCovers.forEach(b => {
  const svg = generateBookSvg(b.title, b.sub, b.color, b.accent);
  fs.writeFileSync(path.join(booksDir, b.file), svg, 'utf-8');
});

// Generate blog images
const blogImages = [
  { file: 'sva-traps.webp', title: 'Top 10 Subject-Verb Traps in SSC & Banking', bg: '#1E3A8A' },
  { file: 'preposition-rules.webp', title: 'Mastering Prepositions: Rules & Confusions', bg: '#7C2D12' },
  { file: 'modals-guide.webp', title: 'Modal Verbs: Eliminating Exam Ambiguity', bg: '#4C1D95' },
  { file: 'default.webp', title: 'ZeroError English Grammar Masterclass', bg: '#18181B' }
];

blogImages.forEach(img => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="blogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${img.bg}" />
      <stop offset="100%" stop-color="#09090B" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#blogBg)" />
  <circle cx="700" cy="100" r="180" fill="#2563EB" fill-opacity="0.15" />
  <rect x="60" y="60" width="160" height="26" rx="4" fill="#2563EB" />
  <text x="75" y="78" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">ZEROERROR LESSON</text>
  <text x="60" y="180" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="36" font-weight="800">
    ${splitText(img.title, 32).map((l, i) => `<tspan x="60" dy="${i === 0 ? 0 : 46}">${escapeXml(l)}</tspan>`).join('')}
  </text>
  <text x="60" y="340" fill="#A1A1AA" font-family="system-ui, sans-serif" font-size="18" font-weight="500">
    Comprehensive Grammar Rule Guide with PYQs &amp; Error Spotting
  </text>
  <line x1="60" y1="380" x2="740" y2="380" stroke="#3F3F46" stroke-width="1"/>
  <text x="60" y="410" fill="#71717A" font-family="system-ui, sans-serif" font-size="14">ZeroErrorEnglish Editorial • Competitive Exam Preparation</text>
</svg>`;
  fs.writeFileSync(path.join(blogDir, img.file), svg, 'utf-8');
});

console.log('Successfully generated all book covers and blog illustrations!');
