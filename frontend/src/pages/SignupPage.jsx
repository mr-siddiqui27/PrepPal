import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, saveAuth } from '../services/authService';
import './AuthPage.css';

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let fieldName = 'fullName';
    if (id === 'signup-email') fieldName = 'email';
    if (id === 'signup-password') fieldName = 'password';

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      saveAuth(response);
      navigate('/dashboard');
    } catch (err) {
      if (err.status === 409) {
        setErrorMessage('An account with this email already exists. Please sign in instead.');
      } else if (err.status === 400 && err.data?.fieldErrors) {
        setFieldErrors(err.data.fieldErrors);
      } else if (err.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage('Unable to connect to the server. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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

        {errorMessage && (
          <div className="auth-alert auth-alert--error" role="alert" id="signup-error-alert">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              className={fieldErrors.fullName ? 'input-error' : ''}
              required
            />
            {fieldErrors.fullName && (
              <span className="auth-field-error" id="signup-name-error">{fieldErrors.fullName}</span>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={fieldErrors.email ? 'input-error' : ''}
              required
            />
            {fieldErrors.email && (
              <span className="auth-field-error" id="signup-email-error">{fieldErrors.email}</span>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Create a strong password (min. 8 characters)"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={fieldErrors.password ? 'input-error' : ''}
              required
            />
            {fieldErrors.password && (
              <span className="auth-field-error" id="signup-password-error">{fieldErrors.password}</span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            id="signup-submit-btn"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Creating Account...' : 'Get Started — It\'s Free'}
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
