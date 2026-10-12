import { Link } from 'react-router-dom';
import './AuthPage.css';

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="8" fill="#4f46e5"/>
            <path d="M7 20L11 8l6 9 3-5 3 8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>PrepPal</span>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start your personalized prep journey today</p>

        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="signup-name">Full Name</label>
            <input id="signup-name" type="text" placeholder="Jane Doe" autoComplete="name" />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" placeholder="Create a strong password" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-primary" id="signup-submit-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Get Started — It&apos;s Free
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" id="switch-to-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
