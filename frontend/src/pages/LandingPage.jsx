import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './LandingPage.css';

/* ── Placement Essentials Data (Reference 1 & 3) ─────────────── */
const essentialsCategories = [
  { id: 'dsa', label: 'DSA Sheets' },
  { id: 'core', label: 'Core Subjects' },
  { id: 'system', label: 'System Design' },
  { id: 'companies', label: 'Company Roadmaps' },
];

const essentialsData = {
  dsa: [
    { title: 'Arrays & Two Pointers', count: '32 Problems', tag: 'Beginner to Med', difficulty: 'Easy-Med' },
    { title: 'Sliding Window & Hashing', count: '24 Problems', tag: 'High Frequency', difficulty: 'Medium' },
    { title: 'Binary Search & Monotonic', count: '28 Problems', tag: 'FAANG Favorite', difficulty: 'Medium' },
    { title: 'Linked Lists & Fast-Slow', count: '18 Problems', tag: 'Foundational', difficulty: 'Easy-Med' },
    { title: 'Binary Trees & BSTs', count: '42 Problems', tag: 'Must Practice', difficulty: 'Med-Hard' },
    { title: 'Dynamic Programming (1D-3D)', count: '56 Problems', tag: 'Essential for MAANG', difficulty: 'Hard' },
    { title: 'Graphs, BFS & DFS', count: '38 Problems', tag: 'Top Priority', difficulty: 'Med-Hard' },
    { title: 'Heaps, Tries & Greedy', count: '22 Problems', tag: 'Advanced Core', difficulty: 'Medium' },
  ],
  core: [
    { title: 'Operating Systems & Concurrency', count: '45 Topics', tag: 'Process, Threads, Memory', difficulty: 'Core' },
    { title: 'DBMS, SQL Queries & Indexing', count: '50 Topics', tag: 'Normalization, ACID, B-Trees', difficulty: 'Core' },
    { title: 'Computer Networks & Protocols', count: '35 Topics', tag: 'TCP/IP, HTTP/3, DNS', difficulty: 'Core' },
    { title: 'Object-Oriented Programming (Java/C++)', count: '30 Topics', tag: 'SOLID, Polymorphism', difficulty: 'Core' },
  ],
  system: [
    { title: 'Low Level Design (LLD) Patterns', count: '25 Patterns', tag: 'Strategy, Observer, Factory', difficulty: 'Design' },
    { title: 'High Level Design (HLD) Concepts', count: '20 Architectures', tag: 'Scaling, Caching, CDN, Sharding', difficulty: 'System' },
    { title: 'Rate Limiter & URL Shortener', count: '8 Case Studies', tag: 'Standard Interview Cases', difficulty: 'Design' },
    { title: 'Distributed Systems & Queues', count: '15 Topics', tag: 'Kafka, Redis, Consensus', difficulty: 'System' },
  ],
  companies: [
    { title: 'Google SDE Prep Sheet', count: '120 Problems', tag: 'Graphs, Hard DP, Trees', difficulty: 'Target: L3/L4' },
    { title: 'Amazon SDE-1 Preparation', count: '95 Problems', tag: 'Arrays, Trees, Leadership Principles', difficulty: 'Target: SDE-1' },
    { title: 'Microsoft & Atlassian Sheet', count: '85 Problems', tag: 'Strings, Graphs, LLD', difficulty: 'Target: SDE-1' },
    { title: 'Uber & Flipkart Core Track', count: '90 Problems', tag: 'Design + Algorithmic Rigor', difficulty: 'Target: SDE-1' },
  ],
};

/* ── Companies Marquee Data (Reference 1 & 2) ────────────────── */
const companiesList = [
  'Google', 'Amazon', 'Microsoft', 'Atlassian', 'Adobe', 'Uber',
  'Flipkart', 'Goldman Sachs', 'Cisco', 'Oracle', 'Swiggy', 'Zomato',
  'Salesforce', 'Morgan Stanley', 'PhonePe', 'Intuit'
];

/* ── Testimonials (Reference 2 & 3) ──────────────────────────── */
const testimonialsList = [
  {
    name: 'Aarav Sharma',
    role: 'SDE-1 @ Amazon',
    stars: 5,
    company: 'Amazon',
    quote: 'PrepPal’s heatmap and subtopic checklist kept me accountable every single day for 6 months. Having everything nested under topics with zero distraction made all the difference.',
  },
  {
    name: 'Priya Iyer',
    role: 'Software Engineer @ Microsoft',
    stars: 5,
    company: 'Microsoft',
    quote: 'I used to lose my revision notes and problem links across Notion and Google Sheets. The way PrepPal lets you attach video links and quick notes to each problem is a game changer.',
  },
  {
    name: 'Karan Verma',
    role: 'Frontend Engineer @ Flipkart',
    stars: 5,
    company: 'Flipkart',
    quote: 'The clean dark theme, compact fonts, and Striver sheet style goal hierarchy made preparing for off-campus drives disciplined and enjoyable.',
  },
  {
    name: 'Rohan Deshmukh',
    role: 'SDE-1 @ Atlassian',
    stars: 5,
    company: 'Atlassian',
    quote: 'Tracked over 350 DSA problems and full LLD design patterns on PrepPal. The streak calendar push notification gave me the exact push I needed.',
  },
  {
    name: 'Sneha Patel',
    role: 'Software Engineer @ Google',
    stars: 5,
    company: 'Google',
    quote: 'The structured hierarchy (Goal > Topic > Subtopic > Task) is brilliant. No clunky spreadsheets, just pure execution and consistency.',
  },
  {
    name: 'Vikram Joshi',
    role: 'Software Engineer @ Uber',
    stars: 5,
    company: 'Uber',
    quote: 'Cleanest placement prep tool out there. The font is crisp, load time is instant, and the daily activity tracker keeps you completely honest.',
  },
];

/* ── FAQ Items with Categories (Reference 2 & 3) ─────────────── */
const faqCategories = ['All Questions', 'DSA Sheets', 'Heatmaps & Streaks', 'Resources & Sync'];

const faqList = [
  {
    category: 'DSA Sheets',
    q: 'Can I follow Striver A2Z DSA and NeetCode 150 on PrepPal?',
    a: 'Yes! PrepPal supports creating multi-tier hierarchical goals with topics, subtopics, and problems that perfectly mirror Striver’s A2Z sheet, NeetCode 150, or your own custom college syllabus.',
  },
  {
    category: 'All Questions',
    q: 'Is PrepPal free for students?',
    a: 'Yes, 100%. Creating goals, adding topics, tracking daily activity heatmaps, and attaching resources is completely free for every student.',
  },
  {
    category: 'Heatmaps & Streaks',
    q: 'How does the daily activity heatmap work?',
    a: 'Every time you check off a problem, create a topic, or complete a study task, PrepPal logs your activity and lights up your LeetCode-style monthly calendar grid to maintain your study streak.',
  },
  {
    category: 'Resources & Sync',
    q: 'Can I attach articles, YouTube solutions, and personal notes?',
    a: 'Yes. Every goal, topic, and subtopic has its own dedicated resource vault where you can attach reference URLs, video lectures, and rich text notes.',
  },
  {
    category: 'Resources & Sync',
    q: 'Is my preparation data secure and synced across devices?',
    a: 'Your progress is stored in a secured MongoDB Atlas cloud database under your authenticated account. You can log in from any phone, laptop, or tablet and your streak and roadmap stay in sync.',
  },
];

/* ── Interactive Hero Visual Component ───────────────────────── */
function HeroVisual() {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const [topic1, setTopic1] = useState(false);
  const [topic2, setTopic2] = useState(false);
  const [topic3, setTopic3] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const goalTitle = 'SDE 2026 Core Mastery';

  useEffect(() => {
    let timeout;
    if (phase === 0) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTyped(goalTitle.slice(0, i));
        if (i >= goalTitle.length) {
          clearInterval(interval);
          timeout = setTimeout(() => setPhase(1), 400);
        }
      }, 45);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
    if (phase === 1) { timeout = setTimeout(() => { setTopic1(true); setPhase(2); }, 450); }
    if (phase === 2) { timeout = setTimeout(() => { setTopic2(true); setPhase(3); }, 500); }
    if (phase === 3) { timeout = setTimeout(() => { setTopic3(true); setPhase(4); }, 500); }
    if (phase === 4) { timeout = setTimeout(() => { setChecked1(true); setPhase(5); }, 650); }
    if (phase === 5) { timeout = setTimeout(() => { setChecked2(true); setPhase(6); }, 450); }
    if (phase === 6) {
      timeout = setTimeout(() => {
        setTyped('');
        setTopic1(false);
        setTopic2(false);
        setTopic3(false);
        setChecked1(false);
        setChecked2(false);
        setPhase(0);
      }, 2600);
    }
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <div className="hero__stack-scene" aria-hidden="true">
      {/* Back card — Rotated slightly */}
      <div className="hero__stack-card hero__stack-card--back">
        <div className="hsc-header">
          <span className="hsc-dot red" />
          <span className="hsc-dot yellow" />
          <span className="hsc-dot green" />
          <span className="hsc-title">Consistency &amp; Heatmap</span>
        </div>
        <div className="hsc-body">
          <div className="hsc-prog-row">
            <div className="hsc-prog-top"><span>Data Structures</span><span className="hsc-pct">82%</span></div>
            <div className="hsc-prog-track"><div className="hsc-prog-fill" style={{ width: '82%', background: '#10b981' }} /></div>
          </div>
          <div className="hsc-prog-row">
            <div className="hsc-prog-top"><span>System Design</span><span className="hsc-pct">60%</span></div>
            <div className="hsc-prog-track"><div className="hsc-prog-fill" style={{ width: '60%', background: '#6366f1' }} /></div>
          </div>
          <div className="hsc-mini-stats">
            <div className="hsc-mini-stat"><span className="hsc-ms-val">24🔥</span><span className="hsc-ms-lbl">Streak</span></div>
            <div className="hsc-mini-stat"><span className="hsc-ms-val">112</span><span className="hsc-ms-lbl">Solved</span></div>
            <div className="hsc-mini-stat"><span className="hsc-ms-val">12</span><span className="hsc-ms-lbl">Mocks</span></div>
          </div>
        </div>
      </div>

      {/* Mid card — Offset to opposite angle */}
      <div className="hero__stack-card hero__stack-card--mid">
        <div className="hsc-header">
          <span className="hsc-dot red" />
          <span className="hsc-dot yellow" />
          <span className="hsc-dot green" />
          <span className="hsc-title">Resource Vault</span>
        </div>
        <div className="hsc-body hsc-body--resources">
          {['NeetCode 150 · Arrays & Hashing', 'Striver A2Z DSA · Two Pointers', 'Low Level Design · Design Patterns', 'SQL & DBMS Core Cheat Sheet'].map((item, idx) => (
            <div key={idx} className="hsc-resource-row">
              <span className="hsc-res-dot" />
              <span className="hsc-res-label">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Front card — Live goal creation and auto-completing tasks */}
      <div className="hero__stack-card hero__stack-card--front">
        <div className="hsc-header">
          <span className="hsc-dot red" />
          <span className="hsc-dot yellow" />
          <span className="hsc-dot green" />
          <span className="hsc-title">Active Preparation Goal</span>
          <div className="hsc-live-dot" title="Live simulation" />
        </div>
        <div className="hsc-body hsc-body--goals">
          <div className="hsc-new-goal-row">
            <span className="hsc-new-label">🎯 Active Goal</span>
            <div className="hsc-typing-box">
              {typed}<span className="hsc-cursor">|</span>
            </div>
          </div>

          <div className="hsc-topics">
            <div className={`hsc-topic-row ${topic1 ? 'hsc-topic--visible' : ''}`}>
              <span className="hsc-topic-icon">📘</span>
              <span className="hsc-topic-name">Arrays &amp; Sliding Window</span>
              <span className="hsc-topic-count">16 tasks</span>
            </div>
            <div className={`hsc-topic-row ${topic2 ? 'hsc-topic--visible' : ''}`}>
              <span className="hsc-topic-icon">🧩</span>
              <span className="hsc-topic-name">Binary Trees &amp; BST</span>
              <span className="hsc-topic-count">24 tasks</span>
            </div>
            <div className={`hsc-topic-row ${topic3 ? 'hsc-topic--visible' : ''}`}>
              <span className="hsc-topic-icon">⚡</span>
              <span className="hsc-topic-name">Dynamic Programming &amp; Graphs</span>
              <span className="hsc-topic-count">28 tasks</span>
            </div>
          </div>

          <div className="hsc-tasks">
            <div className={`hsc-task-row ${checked1 ? 'hsc-task--done' : ''}`}>
              <div className={`hsc-check ${checked1 ? 'hsc-check--active' : ''}`}>{checked1 ? '✓' : ''}</div>
              <span>Trapping Rain Water — Hard</span>
            </div>
            <div className={`hsc-task-row ${checked2 ? 'hsc-task--done' : ''}`}>
              <div className={`hsc-check ${checked2 ? 'hsc-check--active' : ''}`}>{checked2 ? '✓' : ''}</div>
              <span>LRU Cache Implementation — Medium</span>
            </div>
            <div className="hsc-task-row">
              <div className="hsc-check" />
              <span>Word Break Problem — Medium</span>
            </div>
          </div>

          <div className="hsc-goal-footer">
            <span className="hsc-pct-label">{checked1 && checked2 ? 67 : checked1 ? 33 : 0}% tasks completed</span>
            <div className="hsc-progress-track">
              <div className="hsc-progress-fill" style={{ width: `${checked1 && checked2 ? 67 : checked1 ? 33 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badges */}
      <div className="hero__float-badge hfb--1 animate-float">
        <span>✅</span> Topic checked off!
      </div>
      <div className="hero__float-badge hfb--2 animate-float" style={{ animationDelay: '1.5s' }}>
        <span>🔥</span> 24-day study streak
      </div>
    </div>
  );
}

/* ── Main Landing Page ────────────────────────────────────────── */
export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('dsa');
  const [faqCategory, setFaqCategory] = useState('All Questions');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const filteredFaqs = faqCategory === 'All Questions'
    ? faqList
    : faqList.filter(f => f.category === faqCategory);

  return (
    <div className="landing" id="landing-root">

      {/* ── 1. Hero Section (Reference 2 & 3: Clean, Compact Typography) ── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
          <div className="hero__grid" />
        </div>

        <div className="container hero__content">
          {/* Left Column: Focused Text */}
          <div className="hero__text">
            <div className="lp-pill animate-fade-in">
              <span className="lp-pill-spark">⚡</span>
              <span>Placement Season 2026 Ready</span>
            </div>

            <h1 id="hero-heading" className="hero__heading animate-fade-in-up delay-100">
              Your <span className="hero__unfair-word">UNFAIR</span> Advantage<br />
              For Tech Interviews
            </h1>

            <p className="hero__subtext animate-fade-in-up delay-200">
              The all-in-one preparation operating system. Master DSA sheets, track daily heatmaps, organize video notes, and walk into dream company interviews with supreme confidence.
            </p>

            <div className="hero__actions animate-fade-in-up delay-300">
              <Link to="/signup" className="btn btn-primary lp-btn-cta" id="hero-get-started-btn">
                Start Preparing Free
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#essentials" className="btn btn-outline lp-btn-secondary" id="hero-explore-btn">
                Explore Roadmaps
              </a>
            </div>

            <div className="hero__trust-proof animate-fade-in-up delay-400">
              <div className="hero__trust-avatars" aria-hidden="true">
                {['#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#059669'].map((col, idx) => (
                  <div key={idx} className="hero__trust-avatar" style={{ background: col, zIndex: 5 - idx }}>
                    {['S', 'A', 'R', 'K', 'M'][idx]}
                  </div>
                ))}
              </div>
              <div className="hero__trust-text">
                <strong>50,000+ students</strong> preparing from 200+ colleges
              </div>
            </div>
          </div>

          {/* Right Column: 3D Stacked Interactive Visual */}
          <div className="hero__visual animate-fade-in-up delay-200">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── 2. Placement Essentials (Reference 1 & 3: Tabbed Sheet Explorer) ── */}
      <section className="section essentials-section" id="essentials" aria-labelledby="essentials-heading">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-kicker">CURATED ROADMAPS</div>
            <h2 id="essentials-heading" className="section-title">
              Placement Essentials
            </h2>
            <p className="section-subtitle">
              Master the skills that matter. Structured sheets, curated problems, and core CS fundamentals verified by industry engineers.
            </p>

            {/* Filter Tabs */}
            <div className="essentials-tabs">
              {essentialsCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`essentials-tab ${activeTab === cat.id ? 'essentials-tab--active' : ''}`}
                  onClick={() => setActiveTab(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Essentials Grid */}
          <div className="essentials-grid">
            {essentialsData[activeTab]?.map((item, idx) => (
              <div key={idx} className="essential-card">
                <div className="essential-card__top">
                  <span className="essential-card__tag">{item.tag}</span>
                  <span className="essential-card__diff">{item.difficulty}</span>
                </div>
                <h3 className="essential-card__title">{item.title}</h3>
                <div className="essential-card__footer">
                  <span className="essential-card__count">📁 {item.count}</span>
                  <Link to="/goals" className="essential-card__btn">
                    Practice →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. "Your Unfair Advantage Starts Here" (Reference 2: UI Showcase Grid) ── */}
      <section className="section showcase-section" id="features" aria-labelledby="showcase-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-kicker">PRODUCT CAPABILITIES</div>
            <h2 id="showcase-heading" className="section-title">
              Your Unfair Advantage<br />
              Starts Here
            </h2>
            <p className="section-subtitle">
              Every tool in PrepPal is precision-engineered to eliminate confusion and turn chaotic revision into clean, measurable progress.
            </p>
          </div>

          <div className="showcase-grid">
            {/* Feature 1: Topic-wise DSA */}
            <div className="showcase-card">
              <div className="showcase-card__header">
                <span className="showcase-kicker orange">DATA STRUCTURES &amp; ALGORITHMS</span>
                <h3 className="showcase-card__title">Curated Sheets From Top Industry Sources</h3>
                <p className="showcase-card__desc">
                  Structured multi-level hierarchy: Goal → Topic → Subtopic → Individual Problem. Compatible with Striver A2Z and NeetCode 150.
                </p>
              </div>
              <div className="showcase-window">
                <div className="sw-bar">
                  <span className="sw-dot r" /><span className="sw-dot y" /><span className="sw-dot g" />
                  <span className="sw-title">DSA_Sheet_A2Z.cpp</span>
                </div>
                <div className="sw-content">
                  <div className="sw-row done">
                    <span className="sw-check">✓</span>
                    <span className="sw-name">Two Sum &amp; 3Sum Closest</span>
                    <span className="sw-badge easy">Easy</span>
                  </div>
                  <div className="sw-row done">
                    <span className="sw-check">✓</span>
                    <span className="sw-name">Trapping Rain Water (Two Pointers)</span>
                    <span className="sw-badge hard">Hard</span>
                  </div>
                  <div className="sw-row active">
                    <span className="sw-check active">▶</span>
                    <span className="sw-name">Longest Substring Without Repeating</span>
                    <span className="sw-badge med">Medium</span>
                  </div>
                  <div className="sw-row">
                    <span className="sw-check" />
                    <span className="sw-name">Median of Two Sorted Arrays</span>
                    <span className="sw-badge hard">Hard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Heatmap & Streaks */}
            <div className="showcase-card">
              <div className="showcase-card__header">
                <span className="showcase-kicker green">DAILY CONSISTENCY</span>
                <h3 className="showcase-card__title">LeetCode-Grade Heatmap &amp; Streak Engine</h3>
                <p className="showcase-card__desc">
                  Consistency is what cracks tech interviews. Your monthly activity heatmaps log every solved task, giving you visual momentum.
                </p>
              </div>
              <div className="showcase-window">
                <div className="sw-bar">
                  <span className="sw-dot r" /><span className="sw-dot y" /><span className="sw-dot g" />
                  <span className="sw-title">Activity Calendar — 2026</span>
                </div>
                <div className="sw-content sw-content--heatmap">
                  <div className="sw-heatmap-stats">
                    <span>🔥 <strong>24 Days</strong> Current Streak</span>
                    <span>⚡ <strong>184</strong> Total Submissions</span>
                  </div>
                  <div className="sw-heatmap-grid">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div
                        key={i}
                        className="sw-hm-cell"
                        style={{
                          background: i % 5 === 0 ? '#10b981' : i % 3 === 0 ? '#059669' : i % 2 === 0 ? '#047857' : 'rgba(255,255,255,0.06)',
                          opacity: i > 28 ? 0.35 : 1
                        }}
                      />
                    ))}
                  </div>
                  <span className="sw-hm-legend">Less ■ ■ ■ ■ More Active</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Resource Vault */}
            <div className="showcase-card">
              <div className="showcase-card__header">
                <span className="showcase-kicker purple">RESOURCE VAULT</span>
                <h3 className="showcase-card__title">In-Line Video Solutions &amp; Quick Notes</h3>
                <p className="showcase-card__desc">
                  Never lose a YouTube explanation or tricky edge-case note again. Attach links and markdown notes directly to any problem.
                </p>
              </div>
              <div className="showcase-window">
                <div className="sw-bar">
                  <span className="sw-dot r" /><span className="sw-dot y" /><span className="sw-dot g" />
                  <span className="sw-title">Resources &amp; Notes</span>
                </div>
                <div className="sw-content sw-content--vault">
                  <div className="sw-res-card">
                    <span className="sw-res-icon">🎥</span>
                    <div>
                      <div className="sw-res-title">NeetCode: Sliding Window Breakdown</div>
                      <div className="sw-res-meta">youtube.com/watch?v=... · Attached 2d ago</div>
                    </div>
                  </div>
                  <div className="sw-note-card">
                    <div className="sw-note-header">📝 Tricky Edge Case Note</div>
                    <div className="sw-note-body">&quot;If array contains duplicates, binary search degrades to O(N). Handle left == right carefully.&quot;</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Company Specific Mocks */}
            <div className="showcase-card">
              <div className="showcase-card__header">
                <span className="showcase-kicker blue">AI MOCK INTERVIEWS</span>
                <h3 className="showcase-card__title">Company-Targeted Mock Drills</h3>
                <p className="showcase-card__desc">
                  Simulate high-pressure technical and behavioral interviews customized to company question banks (Google, Amazon, Microsoft).
                </p>
              </div>
              <div className="showcase-window">
                <div className="sw-bar">
                  <span className="sw-dot r" /><span className="sw-dot y" /><span className="sw-dot g" />
                  <span className="sw-title">Mock Session · Amazon SDE-1</span>
                </div>
                <div className="sw-content sw-content--chat">
                  <div className="sw-chat-msg ai">
                    <strong>AI Interviewer:</strong> &quot;How would you optimize an LRU Cache to achieve O(1) get and put operations?&quot;
                  </div>
                  <div className="sw-chat-msg user">
                    <strong>You:</strong> &quot;By combining a Hash Map with a Doubly Linked List for constant time eviction...&quot;
                  </div>
                  <div className="sw-chat-eval">
                    ✓ Feedback: Strong data structure intuition · 9.4/10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Product Highlights (Reference 1: 3-column + 2-column Cards) ── */}
      <section className="section highlights-section" aria-labelledby="highlights-heading">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-kicker">ENGINEERING DESIGN</div>
            <h2 id="highlights-heading" className="section-title">
              Product Highlights
            </h2>
            <p className="section-subtitle">
              Built by engineers who went through campus recruitment and off-campus tech drives.
            </p>
          </div>

          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-badge highlight-badge--green">3</div>
              <h3 className="highlight-card__title">3-Tier Hierarchy</h3>
              <p className="highlight-card__desc">
                Clean structuring from high-level Goal down to Topic, Subtopic, and individual checkable Problem.
              </p>
            </div>

            <div className="highlight-card">
              <div className="highlight-badge highlight-badge--icons">
                <span>⚡</span><span>💻</span><span>📁</span>
              </div>
              <h3 className="highlight-card__title">CS Fundamentals Track</h3>
              <p className="highlight-card__desc">
                Curated interview revision sheets for Operating Systems, DBMS SQL queries, Computer Networks, and OOPS.
              </p>
            </div>

            <div className="highlight-card">
              <div className="highlight-badge highlight-badge--green">5★</div>
              <h3 className="highlight-card__title">Top Company Sheets</h3>
              <p className="highlight-card__desc">
                Target company question patterns for Google, Amazon, Microsoft, Uber, and top Indian product startups.
              </p>
            </div>

            <div className="highlight-card highlight-card--wide">
              <div className="highlight-chart-icon">📈</div>
              <div>
                <h3 className="highlight-card__title">Visual Consistency Metrics</h3>
                <p className="highlight-card__desc">
                  Real-time streak calculation and active days count to keep you motivated throughout placement season.
                </p>
              </div>
            </div>

            <div className="highlight-card highlight-card--wide">
              <div className="highlight-key-icon">🔑</div>
              <div>
                <h3 className="highlight-card__title">Zero-Bloat Deterministic Engine</h3>
                <p className="highlight-card__desc">
                  Core roadmaps, checklists, and note-taking never depend on external AI uptime. Your data is always ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Target Companies (Reference 1 & 2: Clean Marquee Pills) ── */}
      <section className="section companies-section" aria-label="Companies cracked by students">
        <div className="container text-center">
          <div className="section-kicker">SUCCESS METRICS</div>
          <h2 className="section-title">
            Top Companies Our Community Aims For
          </h2>
          <p className="section-subtitle">
            Students use PrepPal daily to prepare for internships and full-time SDE roles across tech leaders.
          </p>

          <div className="companies-pills-wrap">
            {companiesList.map(comp => (
              <div key={comp} className="company-pill">
                <span className="company-pill__dot" />
                <span className="company-pill__name">{comp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Student Reviews (Reference 2 & 3: Clean Testimonials Grid) ── */}
      <section className="section testimonials-section" id="reviews" aria-labelledby="reviews-heading">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-kicker">VERIFIED STORIES</div>
            <h2 id="reviews-heading" className="section-title">
              Students Who Cracked It With PrepPal
            </h2>
            <p className="section-subtitle">
              Real engineering students who transformed their consistency and cracked dream tech roles.
            </p>
          </div>

          <div className="reviews-grid">
            {testimonialsList.map((item, idx) => (
              <div key={idx} className="review-card">
                <div className="review-card__top">
                  <div className="review-avatar">{item.name[0]}</div>
                  <div className="review-meta">
                    <h4 className="review-name">{item.name}</h4>
                    <div className="review-stars">{'★'.repeat(item.stars)}</div>
                  </div>
                </div>
                <p className="review-quote">&ldquo;{item.quote}&rdquo;</p>
                <div className="review-company-pill">
                  <span>🏢</span>
                  <strong>{item.role}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ Section (Reference 2 & 3: Two-Column Layout) ──── */}
      <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="container">
          <div className="faq-layout">
            {/* Left Column */}
            <div className="faq-left">
              <div className="section-kicker">QUESTIONS &amp; ANSWERS</div>
              <h2 id="faq-heading" className="section-title">
                Frequently Asked<br />Questions
              </h2>
              <p className="faq-left-desc">
                Have questions about sheets, tracking, or how PrepPal helps your placement prep? We have you covered.
              </p>

              <div className="faq-category-pills">
                {faqCategories.map(cat => (
                  <button
                    key={cat}
                    className={`faq-cat-pill ${faqCategory === cat ? 'faq-cat-pill--active' : ''}`}
                    onClick={() => setFaqCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column Accordion */}
            <div className="faq-right">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-card ${isOpen ? 'faq-card--open' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <span className="faq-icon" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Call to Action Banner ──────────────────────────── */}
      <section className="cta-section" id="get-started">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg" aria-hidden="true" />
            <div className="cta-content">
              <div className="cta-kicker">🚀 GET STARTED TODAY</div>
              <h2 className="cta-title">
                Ready to take your placement prep<br />to the next level?
              </h2>
              <p className="cta-subtitle">
                Join thousands of engineering students who prepare smarter. Zero setup fees, 100% free forever.
              </p>
              <div className="cta-actions">
                <Link to="/signup" className="btn btn-primary lp-btn-cta" id="cta-signup-btn">
                  Create Free Account
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/login" className="btn btn-outline lp-btn-secondary" id="cta-login-btn">
                  Log In to Dashboard
                </Link>
              </div>
              <p className="cta-footnote">Free Forever · No Credit Card Required · Cloud Synced</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
