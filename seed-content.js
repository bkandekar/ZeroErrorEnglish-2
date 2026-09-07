// Script to populate HTML content files for books, posts, topics, practice, and quizzes
import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const dirs = [
  'content/books',
  'content/posts',
  'content/topics',
  'content/practice',
  'content/quizzes'
];

dirs.forEach(d => fs.mkdirSync(path.join(baseDir, d), { recursive: true }));

// ==========================================
// 1. 14 BOOKS (.html files)
// ==========================================
const books = [
  {
    slug: 'subject-verb-agreement-mastery',
    id: 'sva-mastery',
    title: 'Subject-Verb Agreement Mastery Guide',
    topic: 'Subject-Verb Agreement',
    audience: 'SSC CGL, CHSL, Banking, CDS & Academic Exams',
    difficulty: 'Intermediate',
    coverImage: '/assets/images/books/sva-cover.webp',
    imageTags: 'subject-verb-agreement, error-spotting, ssc-cgl, bank-po, grammar-rules, singular-plural',
    benefits: 'Master all 30 foundational and tricky rules, high-frequency parenthetical traps, and 200+ solved exam questions.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPSVA',
    date: '2025-01-15',
    isbn: '979-8877665501',
    description: 'The definitive handbook to conquering Subject-Verb Agreement errors in competitive English exams. Features real exam PYQs, inverted sentence traps, collective noun variations, and instant error spotting mnemonics.',
    features: [
      'All 30 Subject-Verb Agreement Rules broken down step-by-step',
      'The "Parenthetical Phrase Trap" that costs 80% of candidates their marks',
      'Rules for collective nouns, plural titles, and expressions of quantity',
      '200+ Practice questions with exhaustive grammatical explanations',
      'Cheat-sheet of 50 most repeated exam sentences with zero error analysis'
    ]
  },
  {
    slug: 'tenses-decoded',
    id: 'tenses-decoded',
    title: 'Tenses Decoded: Structure, Nuance & Exam Accuracy',
    topic: 'Tenses',
    audience: 'Banking, SSC, UPSC CDS, IELTS & Students',
    difficulty: 'Intermediate',
    coverImage: '/assets/images/books/tenses-cover.webp',
    imageTags: 'tenses, past-perfect, future-perfect, conditionals, time-markers, verb-forms',
    benefits: 'Eliminate confusion between Simple Past vs Past Perfect, Present Perfect vs Past, and mastered future conditional timelines.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPTEN',
    date: '2025-01-20',
    isbn: '979-8877665502',
    description: 'Learn the true logic behind all 12 English tenses. Never make a timeline mistake again with our visual timelines, time marker tables (since/for, by the time, already), and exam error spotting exercises.',
    features: [
      'Visual timeline models for all 12 tenses',
      'The definitive rule on "Since vs For" and "Ago vs Before"',
      'Past Perfect Traps: Identifying earlier vs later past actions',
      'Sequence of Tenses in complex sentences and subordinate clauses',
      '180+ Exam-focused fill-in-the-blanks and error spotters'
    ]
  },
  {
    slug: 'prepositions-simplified',
    id: 'prepositions-simplified',
    title: 'Prepositions Simplified: Fixed Prepositions & Confusions',
    topic: 'Prepositions',
    audience: 'SSC CGL, Bank PO, NDA, Railway & High School',
    difficulty: 'Advanced',
    coverImage: '/assets/images/books/prepositions-cover.webp',
    imageTags: 'prepositions, fixed-prepositions, phrasal-verbs, idioms, ssc-english, bank-english',
    benefits: 'Comprehensive index of 350+ essential fixed prepositions, subtle distinction tables, and prepositions of time/place.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPPRE',
    date: '2025-02-01',
    isbn: '979-8877665503',
    description: 'Stop guessing which preposition follows which verb or adjective. This book compiles over 350 frequently tested fixed preposition combinations with memory anchors and exam-tested practice questions.',
    features: [
      'A-to-Z Directory of 350+ Fixed Preposition Collocations',
      'Crucial distinctions: Differ with vs Differ from, Die of vs Die from',
      'Preposition omission traps (Enter, Discuss, Order, Resemble)',
      'Prepositions followed by Gerunds (-ing forms)',
      '250+ Practice questions categorized by exam difficulty'
    ]
  },
  {
    slug: 'modal-auxiliaries-in-action',
    id: 'modal-auxiliaries',
    title: 'Modal Auxiliaries in Action: Usage, Nuances & Traps',
    topic: 'Modal Auxiliaries',
    audience: 'Competitive Exam Aspirants & English Learners',
    difficulty: 'Intermediate',
    coverImage: '/assets/images/books/modals-cover.webp',
    imageTags: 'modal-verbs, modals, can-could, may-might, should-must, exam-grammar',
    benefits: 'Demystify subtle nuances between May/Might, Can/Could, Must/Should/Ought to, and perfect modal constructions (should have, must have).',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPMOD',
    date: '2025-02-10',
    isbn: '979-8877665504',
    description: 'Modals carry mood and probability. This book provides laser-focused clarity on expressing ability, permission, deduction, obligation, and past speculation without grammatical error.',
    features: [
      'Detailed distinction matrices for all modal pairs',
      'Past Modal speculations: Must have, Could have, Need not have',
      'Semi-modals: Dare, Need, Used to, and their negative inversion rules',
      'Exam traps on double modals and infinitive errors',
      '150+ Objective practice questions with answer keys'
    ]
  },
  {
    slug: 'active-and-passive-voice',
    id: 'active-passive',
    title: 'Active & Passive Voice: Complete Transformation Mastery',
    topic: 'Active & Passive Voice',
    audience: 'SSC CGL Tier 2, CHSL, NDA, CDS & State PSC',
    difficulty: 'Intermediate',
    coverImage: '/assets/images/books/voice-cover.webp',
    imageTags: 'voice, active-passive, sentence-transformation, ssc-tier-2, grammar-rules',
    benefits: 'Master active to passive transformations across all tenses, imperatives, interrogatives, and sentences with two objects.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPVOI',
    date: '2025-02-15',
    isbn: '979-8877665505',
    description: 'Voice transformation carries huge weightage in SSC CGL Tier 2 and State exams. This book ensures you transform complex interrogative, imperative, and passive infinitive sentences with zero hesitation.',
    features: [
      'Formulaic transformation tables for all 8 active tenses',
      'Imperatives: "Let + object + be + V3" vs "You are ordered/requested"',
      'Interrogatives: "Who wrote this?" -> "By whom was this written?"',
      'Passive with prepositions other than "by" (surprised at, pleased with)',
      '300+ Practice conversion drills from previous year papers'
    ]
  },
  {
    slug: 'direct-and-indirect-speech',
    id: 'direct-indirect',
    title: 'Direct & Indirect Speech: Narration Rules & Drills',
    topic: 'Direct & Indirect Speech',
    audience: 'SSC CGL Tier 2, Bank Exams, Defense & High School',
    difficulty: 'Advanced',
    coverImage: '/assets/images/books/speech-cover.webp',
    imageTags: 'narration, direct-indirect, reported-speech, ssc-mains, grammar-guide',
    benefits: 'Master rules of pronoun changes, tense shifts, reporting verb modifications, and exclamation conversions.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPSPE',
    date: '2025-02-20',
    isbn: '979-8877665506',
    description: 'Transform direct quotes into reported speech flawlessly. Covers assertives, interrogatives (Wh- questions & If/Whether), imperatives, optatives, and exclamatory sentences.',
    features: [
      'The "SON" Formula (Subject, Object, No Change) for Pronoun shifts',
      'Tense backshifting chart with exceptions for universal truths',
      'Time and place word conversion table (now -> then, tomorrow -> next day)',
      'Reporting verbs: Exclaimed with joy/sorrow, forbidden to, prayed that',
      '280+ High-yield narration MCQs with in-depth explanations'
    ]
  },
  {
    slug: 'articles-a-an-the',
    id: 'articles-guide',
    title: 'Articles: A, An, The — Zero Error Guide',
    topic: 'Articles',
    audience: 'All Competitive Exams, School & College Students',
    difficulty: 'Beginner',
    coverImage: '/assets/images/books/articles-cover.webp',
    imageTags: 'articles, a-an-the, definite-article, omission-of-articles, english-basics',
    benefits: 'Never get tripped by vowel sounds, omission of articles (school, church, hospital), or proper noun exceptions.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPART',
    date: '2025-02-25',
    isbn: '979-8877665507',
    description: 'Articles look deceptively simple, but they form the backbone of 15% of all competitive error spotting questions. Learn sound-based article usage and the 25 strict rules of article omission.',
    features: [
      'Phonetic sound rules: An honest man, a European, an hour',
      'Zero Article Rules: Before meals, languages, sports, and seasons',
      'Definite Article "The" with geographical features, musical instruments',
      'The "Parallel Comparison Trap": The higher you go, the cooler it gets',
      '150+ Error spotting practice questions with step-by-step logic'
    ]
  },
  {
    slug: 'question-tags-perfected',
    id: 'question-tags',
    title: 'Question Tags Perfected: Rules, Exceptions & Drills',
    topic: 'Question Tags',
    audience: 'SSC, Banking, Spoken English & Competitive Aspirants',
    difficulty: 'Beginner',
    coverImage: '/assets/images/books/tags-cover.webp',
    imageTags: 'question-tags, tags, auxiliary-verbs, spoken-english, exam-tips',
    benefits: 'Master tricky question tags: "I am", negative adverbs (hardly, seldom), imperative tags, and indefinite pronouns.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPQTG',
    date: '2025-03-01',
    isbn: '979-8877665508',
    description: 'Score 100% on Question Tag questions. Learn the exact rules governing "aren\'t I?", "shall we?", "will you?", and negative adverb triggers.',
    features: [
      'Complete rulebook on positive statement -> negative tag and vice versa',
      'Irregular tags: "I am right, aren\'t I?" and "Let\'s dance, shall we?"',
      'Negative words without "not": Seldom, rarely, scarcely, little, few',
      'Pronoun replacement rules for everything, nobody, somebody',
      '120+ Practice questions with instant verification'
    ]
  },
  {
    slug: 'conditional-sentences',
    id: 'conditional-sentences',
    title: 'Conditional Sentences: Zero, First, Second & Third Conditionals',
    topic: 'Conditionals',
    audience: 'Banking, SSC CGL, IELTS, TOEFL & Competitive Exams',
    difficulty: 'Advanced',
    coverImage: '/assets/images/books/conditional-cover.webp',
    imageTags: 'conditionals, if-clauses, wish-clauses, hypothetical-structures, exam-rules',
    benefits: 'Master all conditional patterns, inversion structures ("Had I known..."), and mixed conditionals with zero ambiguity.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPCON',
    date: '2025-03-05',
    isbn: '979-8877665509',
    description: 'Conditionals frequently appear in Sentence Improvement and Cloze Tests. Master the hypothetical past, unreal present, and inversions that examiners use to filter candidates.',
    features: [
      'Structural formulas for Zero, First, Second, and Third Conditionals',
      'Inversion conditionals without "If": "Were I you...", "Had he arrived..."',
      'Wishes and unreal situations with "as if", "as though", "wish", "if only"',
      'High-frequency exam traps regarding "will/would" inside the if-clause',
      '140+ Practice questions with comprehensive explanations'
    ]
  },
  {
    slug: 'gerunds-infinitives-participles',
    id: 'gerunds-infinitives',
    title: 'Gerunds, Infinitives & Participles: Non-Finite Verbs Demystified',
    topic: 'Non-Finite Verbs',
    audience: 'Advanced English Learners, Bank PO & SSC CGL Aspirants',
    difficulty: 'Advanced',
    coverImage: '/assets/images/books/gerund-cover.webp',
    imageTags: 'gerunds, infinitives, participles, non-finite-verbs, dangling-modifiers',
    benefits: 'Clear rules on verbs followed only by Gerunds, verbs taking Infinitives, split infinitives, and dangling participles.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPGER',
    date: '2025-03-10',
    isbn: '979-8877665510',
    description: 'Non-finite verbs cause immense confusion even among fluent speakers. This guide systematically demystifies bare infinitives, prepositional gerunds, and dangling participle errors.',
    features: [
      'Catalog of verbs taking only Gerunds vs verbs taking only Infinitives',
      'Verbs taking both with significant change in meaning (stop, remember, regret)',
      'The Dangling Participle trap and how examiners test it',
      'Bare Infinitive rules after let, make, bid, hear, watch, see',
      '160+ Diagnostic practice drills'
    ]
  },
  {
    slug: 'conjunctions-and-connectors',
    id: 'conjunctions-connectors',
    title: 'Conjunctions & Connectors: Sentence Cohesion & Correlative Pairs',
    topic: 'Conjunctions',
    audience: 'SSC CGL, CHSL, Banking, CDS & Essay Writers',
    difficulty: 'Intermediate',
    coverImage: '/assets/images/books/conjunctions-cover.webp',
    imageTags: 'conjunctions, correlative-conjunctions, sentence-structure, linking-words',
    benefits: 'Master correlative pairs (Not only... but also, Scarcely... when, No sooner... than) and eliminate parallel structure flaws.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPCOJ',
    date: '2025-03-15',
    isbn: '979-8877665511',
    description: 'Ensure tight grammatical cohesion. Understand correlative pairs, parallel structure requirements, and avoid double conjunction errors like "Because... therefore".',
    features: [
      '15 Crucial Correlative Conjunction Pairs you must memorize',
      'The "Parallelism Rule" that must balance both sides of conjunction pairs',
      'Inversion after negative conjunctions (No sooner did he..., Scarcely had she...)',
      'Common red-flag redundancies (Although... yet/but, As... so)',
      '150+ Sentence improvement practice questions'
    ]
  },
  {
    slug: '500-error-spotting-questions',
    id: '500-error-spotting',
    title: '500+ Error Spotting Questions: Comprehensive Exam Handbook',
    topic: 'Error Spotting',
    audience: 'SSC CGL, CHSL, CPO, IBPS PO, SBI Clerk, CDS & NDA Aspirants',
    difficulty: 'Advanced',
    coverImage: '/assets/images/books/error-spotting-cover.webp',
    imageTags: 'error-spotting, practice-handbook, ssc-previous-years, mock-tests, 500-questions',
    benefits: '500 high-yield, rigorously validated error spotting questions covering all parts of speech, with detailed rule citations.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMP500',
    date: '2025-03-20',
    isbn: '979-8877665512',
    description: 'The ultimate practice weapon for competitive exams. 500 hand-picked questions organized by grammar topics and mixed full-length mock sets to test and hone your error detection speed.',
    features: [
      '500 Multi-part Error Spotting Questions (Parts A, B, C, D, No Error)',
      'Topic-wise sets followed by 10 Full-Length Exam Mock sets',
      'Exhaustive answer explanations with exact grammatical rule citations',
      'Examiner trick alerts indicating why incorrect options seem plausible',
      'Performance evaluation scorecard to pinpoint residual weak spots'
    ]
  },
  {
    slug: 'sentence-improvement-handbook',
    id: 'sentence-improvement',
    title: 'Sentence Improvement Handbook: Replace & Refine for Maximum Marks',
    topic: 'Sentence Improvement',
    audience: 'SSC CGL Tier 1 & Tier 2, Banking & State Exams',
    difficulty: 'Intermediate',
    coverImage: '/assets/images/books/sentence-imp-cover.webp',
    imageTags: 'sentence-improvement, sentence-correction, phrase-replacement, competitive-english',
    benefits: 'Learn how to evaluate bracketed sentence segments rapidly, eliminate distractors, and choose idiomatic, grammatically sound phrasing.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPSEN',
    date: '2025-03-25',
    isbn: '979-8877665513',
    description: 'Sentence improvement requires both grammatical rigor and stylistic awareness. This handbook gives you a systematic elimination framework for 350+ standard exam patterns.',
    features: [
      'The 4-Step Sentence Improvement Elimination Method',
      'Phrasal verb replacements and correct prepositional attachments',
      'Conciseness vs Redundancy: Eliminating superfluous words',
      'Parallel structure corrections in compound and complex clauses',
      '350+ Exam-mode questions with comprehensive rationales'
    ]
  },
  {
    slug: 'english-grammar-shortcuts',
    id: 'shortcuts-formulae',
    title: 'English Grammar Shortcuts: Formulae, Mnemonics & Exam Traps',
    topic: 'Grammar Shortcuts',
    audience: 'Aspirants wanting rapid revision & maximum score boost in minimal time',
    difficulty: 'Beginner',
    coverImage: '/assets/images/books/shortcuts-cover.webp',
    imageTags: 'shortcuts, mnemonics, quick-revision, formula-book, last-minute-prep',
    benefits: '100 powerful, time-saving grammar rules summarized as mathematical formulae and catchy mnemonics for rapid exam recall.',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPSHO',
    date: '2025-03-30',
    isbn: '979-8877665514',
    description: 'Revision in the final 15 days before an exam requires condensed rules, not 500-page textbooks. This book distills the entire grammar syllabus into 100 high-impact formulae and memory triggers.',
    features: [
      '100 High-Yield English Grammar Formulae with illustrative examples',
      'Visual summary tables for Subject-Verb, Tenses, Modals & Prepositions',
      'Top 25 Red-Flag exam words that immediately signal an error (e.g. scarcely, lest, unless)',
      'Memory tricks and rhyming mnemonics for tricky grammatical exceptions',
      'Quick-fire 100-question blitz test to assess recall speed'
    ]
  }
];

books.forEach(b => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${b.title} | ZeroErrorEnglish</title>
  <!-- METADATA -->
  <meta name="book:id" content="${b.id}">
  <meta name="book:title" content="${b.title}">
  <meta name="book:slug" content="${b.slug}">
  <meta name="book:topic" content="${b.topic}">
  <meta name="book:targetAudience" content="${b.audience}">
  <meta name="book:difficulty" content="${b.difficulty}">
  <meta name="book:coverImage" content="${b.coverImage}">
  <meta name="book:coverImageAlt" content="Cover image for ${b.title}">
  <meta name="book:imageTags" content="${b.imageTags}">
  <meta name="book:keyBenefits" content="${b.benefits}">
  <meta name="book:amazonUrl" content="${b.amazonUrl}">
  <meta name="book:publishDate" content="${b.date}">
  <meta name="book:isbn" content="${b.isbn}">
  <meta name="book:description" content="${b.description}">
  <!-- /METADATA -->
</head>
<body>
  <div class="book-details-content">
    <section class="book-section">
      <h3>About this eBook</h3>
      <p style="font-size: var(--fs-base); line-height: var(--lh-relaxed); color: var(--text-secondary); margin-bottom: var(--space-6);">
        ${b.description}
      </p>
    </section>

    <section class="book-section">
      <h3>What You Will Learn &amp; Master</h3>
      <div class="feature-check-list">
        ${b.features.map(f => `
          <div class="feature-check-item">
            <svg class="feature-check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <div>${f}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="book-section" id="sample-questions">
      <h3>Sample Exam Traps Covered in this Book</h3>
      <div class="edu-exam-trap">
        <div class="edu-exam-trap-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Examiner's Trap #1</span>
        </div>
        <p>Examiners deliberately insert intervening prepositional phrases to make singular subjects look plural. Learn the exact elimination technique in Chapter 2 of this guide.</p>
      </div>

      <div class="edu-compare-box">
        <div class="compare-col compare-incorrect">
          <div class="compare-label">✕ Common Error Found in Mock Tests</div>
          <div class="compare-sentence">The list of candidate names were published yesterday.</div>
          <div class="compare-explanation">"Were" is grammatically flawed. The subject is "list" (singular).</div>
        </div>
        <div class="compare-col compare-correct">
          <div class="compare-label">✓ Exam-Accurate Version</div>
          <div class="compare-sentence">The list of candidate names was published yesterday.</div>
          <div class="compare-explanation">Correct agreement between "list" and "was".</div>
        </div>
      </div>
    </section>

    <section class="book-section">
      <h3>Frequently Asked Questions</h3>
      <div style="display: flex; flex-direction: column; gap: var(--space-4);">
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: var(--space-5); border-radius: var(--radius-md);">
          <h4 style="font-size: var(--fs-base); font-weight: var(--fw-bold); margin-bottom: var(--space-2);">Is this eBook suitable for beginners?</h4>
          <p style="font-size: var(--fs-sm); color: var(--text-secondary); margin: 0;">Yes. Every chapter begins with core conceptual principles before advancing into tricky exceptions and high-difficulty previous year exam questions.</p>
        </div>
        <div style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: var(--space-5); border-radius: var(--radius-md);">
          <h4 style="font-size: var(--fs-base); font-weight: var(--fw-bold); margin-bottom: var(--space-2);">Can I read this on my phone or computer?</h4>
          <p style="font-size: var(--fs-sm); color: var(--text-secondary); margin: 0;">Yes! Available instantly on Amazon Kindle, which can be read on any smartphone, tablet, laptop, or Kindle e-reader using the free Kindle app.</p>
        </div>
      </div>
    </section>

    <div style="margin-top: var(--space-10); padding: var(--space-8); background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 100%); border: 1px solid var(--primary-border); border-radius: var(--radius-xl); text-align: center;">
      <h3 style="font-size: var(--fs-2xl); font-weight: var(--fw-extrabold); margin-bottom: var(--space-2);">Ready to Eliminate Grammatical Errors?</h3>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-6); max-width: 560px; margin-left: auto; margin-right: auto;">Get instant access to the complete handbook on Amazon KDP today and achieve full marks in competitive English.</p>
      <a href="${b.amazonUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-amazon btn-lg" data-amazon-book="${b.id}" data-book-title="${b.title}">
        Buy on Amazon Kindle
      </a>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(baseDir, `content/books/${b.slug}.html`), htmlContent, 'utf-8');
});

// ==========================================
// 2. BLOG POSTS (.html files)
// ==========================================
const posts = [
  {
    slug: 'subject-verb-agreement-traps-ssc-banking',
    title: 'Top 10 Subject-Verb Agreement Traps in SSC CGL & Bank PO Exams',
    category: 'Grammar Rules',
    grammarTopic: 'Subject-Verb Agreement',
    targetExam: 'SSC CGL, Bank PO, NDA, CDS',
    difficulty: 'Intermediate',
    author: 'ZeroErrorEnglish Editorial',
    readingTime: '7',
    date: '2025-02-18',
    status: 'published',
    excerpt: 'Avoid the most dangerous Subject-Verb Agreement traps set by examiners, including parenthetical clauses, compound subjects, and indefinite pronouns.',
    tags: 'subject-verb-agreement, ssc-cgl, bank-po, error-spotting, exam-traps',
    relatedBooks: 'subject-verb-agreement-mastery',
    featuredImage: '/assets/images/blog/sva-traps.webp',
    content: `
<article>
  <p>In competitive examinations like SSC CGL, CHSL, and IBPS PO, <strong>Subject-Verb Agreement</strong> questions look deceptively straightforward. Yet, statistical analysis reveals that over 65% of test-takers lose marks on this very topic.</p>

  <p>The reason? Question setters know how our human eyes process language. They plant intervening words, inverted clauses, and distracting plural nouns to trick you into matching the verb with the nearest word instead of the true subject.</p>

  <div class="edu-rule-box">
    <div class="edu-rule-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Fundamental Principle</span>
    </div>
    <div class="edu-rule-title">The Proximity Fallacy Rule</div>
    <p>A verb must agree with its grammatical subject in person and number. The proximity of an intervening noun—regardless of whether it is plural or singular—does not alter the subject's number.</p>
  </div>

  <h2>Trap #1: The Parenthetical Phrase Disguise</h2>
  <p>When phrases such as <em>along with, as well as, together with, in addition to, accompanied by, besides,</em> and <em>like</em> join a secondary noun to the subject, they are parenthetical. The verb agrees strictly with the <strong>first subject</strong>.</p>

  <div class="edu-compare-box">
    <div class="compare-col compare-incorrect">
      <div class="compare-label">✕ Exam Trap (Incorrect)</div>
      <div class="compare-sentence">The Prime Minister, along with his cabinet ministers, are visiting the flood-affected districts.</div>
      <div class="compare-explanation">"Are" is wrong because "along with his cabinet ministers" is parenthetical. The subject is the singular "Prime Minister".</div>
    </div>
    <div class="compare-col compare-correct">
      <div class="compare-label">✓ Correct Sentence</div>
      <div class="compare-sentence">The Prime Minister, along with his cabinet ministers, is visiting the flood-affected districts.</div>
      <div class="compare-explanation">Singular subject "Prime Minister" matches singular verb "is".</div>
    </div>
  </div>

  <h2>Trap #2: Either / Neither as Singular Pronouns</h2>
  <p>When used alone as subjects or when followed by "of the + plural noun", <em>Either</em> and <em>Neither</em> are strictly singular and require a singular verb.</p>

  <div class="edu-exam-trap">
    <div class="edu-exam-trap-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Examiner's Favorite Trap</span>
    </div>
    <p>Examiners love writing: <em>"Neither of the two candidates have submitted..."</em>. The plural noun "candidates" distracts you, but "Neither" is the subject and strictly commands <strong>has</strong>!</p>
  </div>

  <h2>Interactive Practice Drill</h2>
  <div class="edu-practice-box">
    <span class="edu-practice-badge">Exam Practice Check</span>
    <div class="edu-practice-question">A bouquet of freshly cut yellow roses ______ delivered to the professor's office this morning.</div>
    <div class="edu-practice-options">
      <button type="button" class="edu-option-btn" data-correct="true">A) was</button>
      <button type="button" class="edu-option-btn" data-correct="false">B) were</button>
      <button type="button" class="edu-option-btn" data-correct="false">C) have been</button>
      <button type="button" class="edu-option-btn" data-correct="false">D) are</button>
    </div>
    <div class="edu-practice-feedback" data-explanation="The head subject is 'bouquet' (singular collective unit), not 'roses'. Hence, 'was' is the correct verb."></div>
  </div>

  <div class="edu-remember-box">
    <div class="edu-remember-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      <span>Memory Anchor</span>
    </div>
    <p>Mentally bracket any phrase beginning with a preposition (<em>of, in, with, on, by</em>) between the subject and the verb. Read the sentence skipping the bracketed part to immediately detect number mismatch!</p>
  </div>
</article>`
  },
  {
    slug: 'mastering-fixed-prepositions-rules-and-confusions',
    title: 'Mastering Fixed Prepositions: 50 Most Repeated Exam Pairs',
    category: 'Grammar Rules',
    grammarTopic: 'Prepositions',
    targetExam: 'SSC CGL, Banking, NDA, CDS',
    difficulty: 'Advanced',
    author: 'ZeroErrorEnglish Editorial',
    readingTime: '8',
    date: '2025-02-25',
    status: 'published',
    excerpt: 'Detailed breakdown of high-frequency fixed prepositions like differ with vs differ from, die of vs die from, and prepositions with verbs of perception.',
    tags: 'prepositions, fixed-prepositions, exam-traps, ssc-english, vocabulary',
    relatedBooks: 'prepositions-simplified',
    featuredImage: '/assets/images/blog/preposition-rules.webp',
    content: `
<article>
  <p>Unlike vocabulary or basic tenses where logic can guide you, <strong>Fixed Prepositions</strong> are idiomatic collocations governed by established convention. In competitive English, they are the number one source of negative marking.</p>

  <h2>1. "Differ with" vs "Differ from"</h2>
  <p>This pair causes immense confusion. Here is the definitive distinction:</p>
  <ul>
    <li><strong>Differ with:</strong> Used when disagreeing with a person in opinion or perspective.</li>
    <li><strong>Differ from:</strong> Used when indicating contrast in physical appearance, nature, or quality between things or people.</li>
  </ul>

  <div class="edu-compare-box">
    <div class="compare-col compare-incorrect">
      <div class="compare-label">✕ Common Error</div>
      <div class="compare-sentence">I differ from you on this political subject.</div>
      <div class="compare-explanation">When disagreeing with a person's opinion, use "differ with".</div>
    </div>
    <div class="compare-col compare-correct">
      <div class="compare-label">✓ Correct Sentence</div>
      <div class="compare-sentence">I differ with you on this political subject.</div>
      <div class="compare-explanation">"Differ with a person" on an issue.</div>
    </div>
  </div>

  <h2>2. "Die of" vs "Die from"</h2>
  <p>Examiners frequently test this medical distinction in cloze tests and error spotting:</p>
  <div class="edu-rule-box">
    <div class="edu-rule-title">The Cause of Death Principle</div>
    <p>Use <strong>die of</strong> when the cause is an internal disease, hunger, thirst, or shame (e.g., <em>He died of malaria</em>). Use <strong>die from</strong> when the cause is an indirect or external factor like loss of blood, overwork, or food poisoning (e.g., <em>He died from over-exhaustion</em>).</p>
  </div>

  <h2>3. Verbs that Take NO Preposition</h2>
  <p>Beware of transitive verbs that examiners incorrectly attach prepositions to:</p>
  <ul>
    <li>Do NOT say: <em>discuss about</em> (Say: <strong>discuss the matter</strong>)</li>
    <li>Do NOT say: <em>enter into the room</em> (Say: <strong>enter the room</strong>)</li>
    <li>Do NOT say: <em>resemble to his father</em> (Say: <strong>resembles his father</strong>)</li>
    <li>Do NOT say: <em>order for coffee</em> (Say: <strong>order coffee</strong>)</li>
  </ul>

  <h2>Interactive Practice Drill</h2>
  <div class="edu-practice-box">
    <span class="edu-practice-badge">Exam Practice Check</span>
    <div class="edu-practice-question">The elderly judge is well known for abstaining ______ alcohol throughout his career.</div>
    <div class="edu-practice-options">
      <button type="button" class="edu-option-btn" data-correct="true">A) from</button>
      <button type="button" class="edu-option-btn" data-correct="false">B) to</button>
      <button type="button" class="edu-option-btn" data-correct="false">C) with</button>
      <button type="button" class="edu-option-btn" data-correct="false">D) of</button>
    </div>
    <div class="edu-practice-feedback" data-explanation="'Abstain' strictly takes 'from'. Similarly, refrain, prevent, prohibit, and deter also take 'from'."></div>
  </div>
</article>`
  },
  {
    slug: 'modal-verbs-eliminating-exam-ambiguity',
    title: 'Modal Verbs: Eliminating Exam Ambiguity Between Should, Must & Ought',
    category: 'Exam Traps',
    grammarTopic: 'Modal Auxiliaries',
    targetExam: 'Banking, SSC, CDS',
    difficulty: 'Intermediate',
    author: 'ZeroErrorEnglish Editorial',
    readingTime: '6',
    date: '2025-03-02',
    status: 'published',
    excerpt: 'Understand how subtle shifts in modality change grammatical accuracy in competitive examination questions.',
    tags: 'modals, auxiliary-verbs, should-must, exam-preparation',
    relatedBooks: 'modal-auxiliaries-in-action',
    featuredImage: '/assets/images/blog/modals-guide.webp',
    content: `
<article>
  <p>Modal auxiliaries convey the speaker's attitude: necessity, obligation, probability, permission, or past regret. Misidentifying the intended tone leads directly to error.</p>

  <h2>Obligation Scale: Should vs Ought to vs Must</h2>
  <ul>
    <li><strong>Should:</strong> Expresses general advice, recommendation, or suggestion (<em>You should sleep early</em>).</li>
    <li><strong>Ought to:</strong> Expresses moral duty, social obligation, or strong ethical expectation (<em>We ought to respect our national flag</em>).</li>
    <li><strong>Must:</strong> Expresses compulsory legal or administrative obligation, or logical certainty (<em>You must carry your original ID to the examination center</em>).</li>
  </ul>

  <div class="edu-exam-trap">
    <div class="edu-exam-trap-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Exam Trap: Past Regrets with "Should Have"</span>
    </div>
    <p>Candidates frequently confuse <em>should have</em> (something didn't happen, but was desirable) with <em>must have</em> (strong past logical deduction). For example: <em>"He must have reached home by now"</em> (deduction) vs <em>"He should have submitted the form yesterday"</em> (failure to do so).</p>
  </div>
</article>`
  },
  {
    slug: 'future-scheduled-post-tenses',
    title: 'Future Scheduled: 5 Secrets to Perfect Tenses in Cloze Tests',
    category: 'Exam Traps',
    grammarTopic: 'Tenses',
    targetExam: 'SSC CGL, Banking',
    difficulty: 'Advanced',
    author: 'ZeroErrorEnglish Editorial',
    readingTime: '5',
    date: '2026-09-10',
    status: 'scheduled',
    scheduledAt: '2026-09-10T10:00:00.000Z',
    excerpt: 'A preview of our upcoming guide on identifying tense consistency across long reading comprehension passages and cloze tests.',
    tags: 'tenses, cloze-test, scheduled-post',
    relatedBooks: 'tenses-decoded',
    featuredImage: '/assets/images/blog/default.webp',
    content: `
<article>
  <p>Scheduled article demonstrating the automatic publishing system of ZeroErrorEnglish CMS. This article demonstrates how scheduled posts automatically appear in the blog once their scheduled time arrives!</p>
</article>`
  }
];

posts.forEach(p => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${p.title} | ZeroErrorEnglish</title>
  <!-- METADATA -->
  <meta name="post:id" content="${p.slug}">
  <meta name="post:title" content="${p.title}">
  <meta name="post:slug" content="${p.slug}">
  <meta name="post:category" content="${p.category}">
  <meta name="post:grammarTopic" content="${p.grammarTopic}">
  <meta name="post:targetExam" content="${p.targetExam}">
  <meta name="post:difficulty" content="${p.difficulty}">
  <meta name="post:publishDate" content="${p.date}">
  <meta name="post:updatedAt" content="${p.date}">
  <meta name="post:author" content="${p.author}">
  <meta name="post:readingTime" content="${p.readingTime}">
  <meta name="post:excerpt" content="${p.excerpt}">
  <meta name="post:tags" content="${p.tags}">
  <meta name="post:relatedBooks" content="${p.relatedBooks}">
  <meta name="post:seoTitle" content="${p.title}">
  <meta name="post:metaDescription" content="${p.excerpt}">
  <meta name="post:featuredImage" content="${p.featuredImage}">
  <meta name="post:featuredImageAlt" content="${p.title}">
  <meta name="post:status" content="${p.status}">
  <meta name="post:scheduledAt" content="${p.scheduledAt || ''}">
  <!-- /METADATA -->
</head>
<body>
  ${p.content}
</body>
</html>`;

  fs.writeFileSync(path.join(baseDir, `content/posts/${p.slug}.html`), htmlContent, 'utf-8');
});

// ==========================================
// 3. GRAMMAR TOPICS (.html files)
// ==========================================
const topics = [
  {
    slug: 'subject-verb-agreement',
    title: 'Subject-Verb Agreement',
    category: 'Syntax & Agreement',
    difficulty: 'Intermediate',
    desc: 'The singular/plural concord between subjects and finite verbs in sentences.',
    summary: 'Identify the true subject, disregard prepositional modifiers, follow proximity rules with either/or, and recognize collective noun units.',
    bookSlug: 'subject-verb-agreement-mastery'
  },
  {
    slug: 'tenses',
    title: 'Tenses & Time Markers',
    category: 'Verbs & Timeline',
    difficulty: 'Intermediate',
    desc: 'The 12 tenses describing state and progression across past, present, and future.',
    summary: 'Coordinate main and subordinate clause tenses, adhere to since/for rules, and avoid past perfect overuse.',
    bookSlug: 'tenses-decoded'
  },
  {
    slug: 'prepositions',
    title: 'Prepositions & Fixed Collocations',
    category: 'Parts of Speech',
    difficulty: 'Advanced',
    desc: 'Spatial, temporal, and fixed prepositional attachments to verbs and adjectives.',
    summary: 'Learn established combinations (abstain from, senior to, die of), avoid unnecessary prepositions after transitive verbs.',
    bookSlug: 'prepositions-simplified'
  },
  {
    slug: 'modal-auxiliaries',
    title: 'Modal Auxiliaries',
    category: 'Verbs',
    difficulty: 'Intermediate',
    desc: 'Helping verbs indicating mood, ability, obligation, probability, or permission.',
    summary: 'Master distinction between should/must/ought to, semi-modals dare/need, and past speculation structures.',
    bookSlug: 'modal-auxiliaries-in-action'
  },
  {
    slug: 'active-passive-voice',
    title: 'Active & Passive Voice',
    category: 'Transformations',
    difficulty: 'Intermediate',
    desc: 'Syntactic shift focusing either on the doer or recipient of the action.',
    summary: 'Ensure tense retention with appropriate be-verb + V3 form across assertions, imperatives, and interrogatives.',
    bookSlug: 'active-and-passive-voice'
  },
  {
    slug: 'direct-indirect-speech',
    title: 'Direct & Indirect Speech',
    category: 'Transformations',
    difficulty: 'Advanced',
    desc: 'Reporting spoken statements without altering original meaning or intent.',
    summary: 'Apply pronoun adjustments (SON rule), backshift tenses, update time/place anchors, and select precise reporting verbs.',
    bookSlug: 'direct-and-indirect-speech'
  }
];

topics.forEach(t => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${t.title} | ZeroErrorEnglish</title>
  <!-- METADATA -->
  <meta name="topic:title" content="${t.title}">
  <meta name="topic:slug" content="${t.slug}">
  <meta name="topic:category" content="${t.category}">
  <meta name="topic:difficulty" content="${t.difficulty}">
  <meta name="topic:description" content="${t.desc}">
  <meta name="topic:coreRuleSummary" content="${t.summary}">
  <meta name="topic:relatedBookSlug" content="${t.bookSlug}">
  <!-- /METADATA -->
</head>
<body>
  <div class="topic-overview">
    <h2>Overview of ${t.title}</h2>
    <p>${t.desc}</p>
    <div class="edu-rule-box">
      <div class="edu-rule-title">Core Principle Summary</div>
      <p>${t.summary}</p>
    </div>
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(baseDir, `content/topics/${t.slug}.html`), html, 'utf-8');
});

// ==========================================
// 4. PRACTICE QUESTIONS (.html files)
// ==========================================
const practiceQuestions = [
  {
    id: 'pq-001',
    topic: 'Subject-Verb Agreement',
    type: 'Error Spotting',
    difficulty: 'Intermediate',
    exam: 'SSC CGL',
    sentence: '(A) The captain along with / (B) his crew members / (C) were drowned / (D) in the violent sea storm. / (E) No Error',
    options: 'Part (A)|Part (B)|Part (C)|Part (D)|No Error',
    correctAnswerIndex: '2',
    ruleCitation: 'When two subjects are joined by "along with", the verb agrees with the first subject ("captain", singular, hence "was drowned").',
    relatedBookSlug: 'subject-verb-agreement-mastery',
    relatedBookTitle: 'Subject-Verb Agreement Mastery Guide',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPSVA'
  },
  {
    id: 'pq-002',
    topic: 'Prepositions',
    type: 'Error Spotting',
    difficulty: 'Advanced',
    exam: 'Bank PO',
    sentence: '(A) Despite of the heavy rains / (B) the rescue committee / (C) succeeded in reaching / (D) the stranded passengers. / (E) No Error',
    options: 'Part (A)|Part (B)|Part (C)|Part (D)|No Error',
    correctAnswerIndex: '0',
    ruleCitation: '"Despite" never takes the preposition "of". Use either "Despite" alone or "In spite of".',
    relatedBookSlug: 'prepositions-simplified',
    relatedBookTitle: 'Prepositions Simplified',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPPRE'
  },
  {
    id: 'pq-003',
    topic: 'Tenses',
    type: 'Sentence Improvement',
    difficulty: 'Intermediate',
    exam: 'CDS',
    question: 'The train [had departed before we reached] the railway station platform.',
    options: 'had departed before we reached|departed before we reached|has departed before we reached|No improvement needed',
    correctAnswerIndex: '0',
    ruleCitation: 'When two past actions occur in sequence, the earlier past action takes Past Perfect ("had departed") and the subsequent action takes Simple Past ("reached").',
    relatedBookSlug: 'tenses-decoded',
    relatedBookTitle: 'Tenses Decoded',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPTEN'
  },
  {
    id: 'pq-004',
    topic: 'Question Tags',
    type: 'Error Spotting',
    difficulty: 'Beginner',
    exam: 'SSC CHSL',
    sentence: '(A) Let us commence / (B) the evening lecture now, / (C) will we? / (D) No Error',
    options: 'Part (A)|Part (B)|Part (C)|Part (D)',
    correctAnswerIndex: '2',
    ruleCitation: 'Proposals starting with "Let us" or "Let\'s" strictly take the question tag "shall we?", not "will we?".',
    relatedBookSlug: 'question-tags-perfected',
    relatedBookTitle: 'Question Tags Perfected',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPQTG'
  },
  {
    id: 'pq-005',
    topic: 'Modal Auxiliaries',
    type: 'Fill in the Blanks',
    difficulty: 'Intermediate',
    exam: 'IBPS PO',
    question: 'The committee was so divided that they ______ not arrive at a unanimous consensus even after five hours of debate.',
    options: 'could|might|should|would',
    correctAnswerIndex: '0',
    ruleCitation: '"Could not" expresses past inability in expressing an outcome.',
    relatedBookSlug: 'modal-auxiliaries-in-action',
    relatedBookTitle: 'Modal Auxiliaries in Action',
    amazonUrl: 'https://www.amazon.com/dp/B0EXAMPMOD'
  }
];

practiceQuestions.forEach(pq => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Practice ${pq.id} | ZeroErrorEnglish</title>
  <!-- METADATA -->
  <meta name="practice:id" content="${pq.id}">
  <meta name="practice:topic" content="${pq.topic}">
  <meta name="practice:type" content="${pq.type}">
  <meta name="practice:difficulty" content="${pq.difficulty}">
  <meta name="practice:exam" content="${pq.exam}">
  <meta name="practice:question" content="${pq.question || ''}">
  <meta name="practice:sentence" content="${pq.sentence || ''}">
  <meta name="practice:options" content="${pq.options}">
  <meta name="practice:correctAnswerIndex" content="${pq.correctAnswerIndex}">
  <meta name="practice:ruleCitation" content="${pq.ruleCitation}">
  <meta name="practice:relatedBookSlug" content="${pq.relatedBookSlug}">
  <meta name="practice:relatedBookTitle" content="${pq.relatedBookTitle}">
  <meta name="practice:amazonUrl" content="${pq.amazonUrl}">
  <!-- /METADATA -->
</head>
<body>
  <div>${pq.question || pq.sentence}</div>
</body>
</html>`;
  fs.writeFileSync(path.join(baseDir, `content/practice/${pq.id}.html`), html, 'utf-8');
});

// ==========================================
// 5. QUIZZES (.html files)
// ==========================================
const quizHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Comprehensive English Grammar Diagnostic Quiz</title>
  <!-- METADATA -->
  <meta name="quiz:id" content="comprehensive-grammar-quiz">
  <meta name="quiz:title" content="Comprehensive English Grammar Diagnostic Quiz">
  <meta name="quiz:topic" content="All Topics">
  <meta name="quiz:difficulty" content="Intermediate">
  <meta name="quiz:timeLimitMinutes" content="10">
  <meta name="quiz:totalQuestions" content="6">
  <!-- /METADATA -->
</head>
<body>
  <div class="quiz-questions">
    <div class="quiz-question"
         data-question="Neither the teacher nor the students ______ present in the auditorium when the ceremony started."
         data-topic="Subject-Verb Agreement"
         data-difficulty="Intermediate"
         data-options="was|were|is|has been"
         data-correct="1"
         data-explanation="When two subjects are connected by 'neither... nor', the verb agrees with the closer subject ('students', plural, hence 'were').">
    </div>
    <div class="quiz-question"
         data-question="The officer is senior ______ me by three years in service."
         data-topic="Prepositions"
         data-difficulty="Intermediate"
         data-options="than|to|from|with"
         data-correct="1"
         data-explanation="Latin comparative adjectives ending in -ior (senior, junior, superior, inferior) take 'to', never 'than'.">
    </div>
    <div class="quiz-question"
         data-question="By this time next year, she ______ her doctoral dissertation."
         data-topic="Tenses"
         data-difficulty="Advanced"
         data-options="will complete|will have completed|completed|has completed"
         data-correct="1"
         data-explanation="Future Perfect Tense ('will have completed') denotes an action to be completed by a specified future time milestone.">
    </div>
    <div class="quiz-question"
         data-question="Let us begin the mock examination now, ______?"
         data-topic="Question Tags"
         data-difficulty="Beginner"
         data-options="shall we|will you|shouldn't we|can we"
         data-correct="0"
         data-explanation="Sentences starting with 'Let us' or 'Let\'s' take the question tag 'shall we?'.">
    </div>
    <div class="quiz-question"
         data-question="Candidates ______ submit their admit cards prior to entering the exam hall without fail."
         data-topic="Modal Auxiliaries"
         data-difficulty="Intermediate"
         data-options="might|must|could|would"
         data-correct="1"
         data-explanation="'Must' conveys compulsory requirement without exception.">
    </div>
    <div class="quiz-question"
         data-question="Choose the correct passive voice: 'They are renovating the old library building.'"
         data-topic="Active &amp; Passive Voice"
         data-difficulty="Intermediate"
         data-options="The old library building is renovated by them.|The old library building is being renovated by them.|The old library building has been renovated.|The old library building was being renovated."
         data-correct="1"
         data-explanation="Present continuous active ('are renovating') transforms to 'is/are being + V3' ('is being renovated').">
    </div>
  </div>
</body>
</html>`;
fs.writeFileSync(path.join(baseDir, 'content/quizzes/comprehensive-quiz.html'), quizHtml, 'utf-8');

console.log('Successfully generated all HTML content files for books, posts, topics, practice, and quizzes!');
