import { Link } from 'react-router-dom';
import './AuthPage.css';

export default function LoginPage() {
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
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your journey</p>

        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary" id="login-submit-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link to="/signup" id="switch-to-signup">Get started free</Link>
        </p>
      </div>
    </div>
  );
}
