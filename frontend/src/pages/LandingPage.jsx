import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import './LandingPage.css';

/* ── Feature data ───────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h6l2 7H5L3 3z"/>
        <path d="M13 3h6l2 7h-6l-2-7z"/>
        <path d="M5 10v8a2 2 0 002 2h10a2 2 0 002-2v-8"/>
        <path d="M12 10v10"/>
      </svg>
    ),
    title: 'Personalized Roadmaps',
    description:
      'Get a tailored learning roadmap built around your skills, goals, and target roles. PrepPal adapts as you grow, keeping your path always relevant.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Progress Tracking',
    description:
      'Visualize your growth with detailed progress dashboards. Track completed milestones, skill levels, and daily streaks to stay motivated.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <line x1="10" y1="8" x2="16" y2="8"/>
        <line x1="10" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    title: 'Learning Resources',
    description:
      'Access curated, high-quality resources hand-picked for each topic on your roadmap — articles, videos, exercises, and practice problems.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'AI Interview Prep',
    description:
      'Practice with AI-driven mock interviews tailored to your target companies and roles. Get instant feedback on your answers and communication.',
  },
];

/* ── How It Works steps ─────────────────────────────────────── */
const steps = [
  { step: '01', title: 'Create Your Profile', description: 'Tell us about your background, current skills, and career goals.' },
  { step: '02', title: 'Get Your Roadmap', description: 'Receive a personalized AI-generated learning roadmap in seconds.' },
  { step: '03', title: 'Learn & Practice', description: 'Follow curated resources and practice with AI mock interviews.' },
  { step: '04', title: 'Land the Role', description: 'Apply with confidence knowing you\'re fully prepared for success.' },
];

/* ── Stats ──────────────────────────────────────────────────── */
const stats = [
  { value: '50K+', label: 'Students Guided' },
  { value: '95%', label: 'Interview Success Rate' },
  { value: '200+', label: 'Career Roadmaps' },
  { value: '4.9 ★', label: 'Average Rating' },
];

/* ── Component ──────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="landing">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        {/* Background decoration */}
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
          <div className="hero__grid" />
        </div>

        <div className="container hero__content">
          <div className="hero__text">
            <div className="badge badge-primary animate-fade-in" style={{ marginBottom: '1.5rem' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <circle cx="6" cy="6" r="6"/>
              </svg>
              AI-Powered Career Preparation
            </div>

            <h1 id="hero-heading" className="hero__heading animate-fade-in-up delay-100">
              Prepare Smarter,<br />
              <span className="hero__heading-gradient">Land Faster</span>
            </h1>

            <p className="hero__subtext animate-fade-in-up delay-200">
              PrepPal is your intelligent career companion. Get a personalized study roadmap,
              track your progress, access curated resources, and ace your interviews with AI-powered practice.
            </p>

            <div className="hero__actions animate-fade-in-up delay-300">
              <Link to="/signup" className="btn btn-primary btn-lg" id="hero-get-started-btn">
                Get Started — It&apos;s Free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg" id="hero-login-btn">
                Log In
              </Link>
            </div>

            <div className="hero__social-proof animate-fade-in-up delay-400">
              <div className="hero__avatars" aria-hidden="true">
                {['#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#059669'].map((c, i) => (
                  <div key={i} className="hero__avatar" style={{ background: c, zIndex: 5 - i }}>
                    {['A', 'B', 'C', 'D', 'E'][i]}
                  </div>
                ))}
              </div>
              <p className="hero__social-text">
                <strong>50,000+</strong> students already on their journey
              </p>
            </div>
          </div>

          <div className="hero__visual animate-fade-in-up delay-200" aria-hidden="true">
            <div className="hero__dashboard-card">
              <div className="hero__card-header">
                <div className="hero__card-dot" style={{ background: '#ef4444' }} />
                <div className="hero__card-dot" style={{ background: '#f59e0b' }} />
                <div className="hero__card-dot" style={{ background: '#10b981' }} />
                <span className="hero__card-title">My Learning Dashboard</span>
              </div>
              <div className="hero__card-body">
                <div className="hero__progress-item">
                  <div className="hero__progress-label">
                    <span>Data Structures</span>
                    <span className="hero__progress-pct">78%</span>
                  </div>
                  <div className="hero__progress-bar">
                    <div className="hero__progress-fill" style={{ width: '78%', background: 'var(--color-primary-500)' }} />
                  </div>
                </div>
                <div className="hero__progress-item">
                  <div className="hero__progress-label">
                    <span>System Design</span>
                    <span className="hero__progress-pct">52%</span>
                  </div>
                  <div className="hero__progress-bar">
                    <div className="hero__progress-fill" style={{ width: '52%', background: '#7c3aed' }} />
                  </div>
                </div>
                <div className="hero__progress-item">
                  <div className="hero__progress-label">
                    <span>Behavioral Interview</span>
                    <span className="hero__progress-pct">91%</span>
                  </div>
                  <div className="hero__progress-bar">
                    <div className="hero__progress-fill" style={{ width: '91%', background: 'var(--color-success)' }} />
                  </div>
                </div>
                <div className="hero__card-stats">
                  <div className="hero__card-stat">
                    <span className="hero__card-stat-value">14</span>
                    <span className="hero__card-stat-label">Day Streak 🔥</span>
                  </div>
                  <div className="hero__card-stat">
                    <span className="hero__card-stat-value">43</span>
                    <span className="hero__card-stat-label">Topics Done</span>
                  </div>
                  <div className="hero__card-stat">
                    <span className="hero__card-stat-value">7</span>
                    <span className="hero__card-stat-label">Mock Interviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="hero__float-badge hero__float-badge--1 animate-float">
              <span>🎯</span> Interview in 3 days
            </div>
            <div className="hero__float-badge hero__float-badge--2 animate-float" style={{ animationDelay: '1.2s' }}>
              <span>✅</span> Roadmap updated!
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="stats-section" aria-label="PrepPal statistics">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="section features-section" id="features" aria-labelledby="features-heading">
        <div className="container">
          <div className="section-header text-center">
            <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Everything You Need</div>
            <h2 id="features-heading" className="section-title">
              Built for <span className="text-gradient">career success</span>
            </h2>
            <p className="section-subtitle">
              PrepPal combines AI intelligence with proven study methods to give you the most efficient path to your dream role.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="section how-it-works" id="how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-header text-center">
            <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Simple Process</div>
            <h2 id="how-heading" className="section-title">
              From zero to <span className="text-gradient">offer letter</span>
            </h2>
            <p className="section-subtitle">
              Four simple steps separate you from your next career breakthrough.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.step} className="step-item animate-fade-in-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="step-number">{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-description">{s.description}</p>
                {i < steps.length - 1 && <div className="step-connector" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="cta-section" id="roadmap" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg" aria-hidden="true" />
            <div className="cta-content">
              <h2 id="cta-heading" className="cta-title">
                Ready to start your journey?
              </h2>
              <p className="cta-subtitle">
                Join thousands of students who've already transformed their career trajectory with PrepPal.
                Your personalized roadmap is one click away.
              </p>
              <div className="cta-actions">
                <Link to="/signup" className="btn btn-lg" id="cta-signup-btn" style={{ background: '#ffffff', color: 'var(--color-primary-700)', fontWeight: 700 }}>
                  Get Your Free Roadmap
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <p className="cta-note">No credit card required · Free forever plan available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
