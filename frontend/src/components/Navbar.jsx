import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getToken, getCurrentUser, logout } from '../services/authService';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getToken());
  const [user, setUser] = useState(getCurrentUser());

  // Listen for user updates (e.g. profile photo or name change)
  useEffect(() => {
    const handleUserUpdate = (e) => {
      setUser(e?.detail || getCurrentUser());
    };
    window.addEventListener('preppal-user-updated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    return () => {
      window.removeEventListener('preppal-user-updated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme Management (dark vs light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('preppal_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preppal_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} id="main-navbar">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <span className="navbar__logo-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="8" fill="#4f46e5"/>
              <path d="M7 20L11 8l6 9 3-5 3 8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="navbar__logo-text">PrepPal</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar__links" aria-label="Primary navigation">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar__link" id="nav-link-dashboard">Dashboard</Link>
              <Link to="/goals" className="navbar__link" id="nav-link-goals">Goals</Link>
              <Link to="/profile" className="navbar__link" id="nav-link-profile">Profile</Link>
            </>
          ) : (
            <>
              <a href="#features" className="navbar__link">Features</a>
              <a href="#how-it-works" className="navbar__link">How it Works</a>
              <a href="#roadmap" className="navbar__link">Roadmap</a>
            </>
          )}
        </nav>

        {/* CTA Buttons & Theme Toggle */}
        <div className="navbar__actions">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle color theme"
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-primary btn-sm lp-nav-db-btn" id="navbar-dashboard-btn">
                Dashboard →
              </Link>

              {/* User Avatar Menu */}
              <div className="navbar__user-wrap" ref={dropdownRef}>
                <button
                  className="navbar__avatar-btn"
                  onClick={() => setUserMenuOpen(prev => !prev)}
                  title={user?.fullName || 'Profile menu'}
                  aria-label="User profile menu"
                  aria-expanded={userMenuOpen}
                  id="navbar-user-avatar-btn"
                >
                  <div className="navbar__avatar-circle">
                    {user?.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt={user.fullName || 'User'} className="navbar__avatar-img" />
                    ) : (
                      user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <span className="navbar__avatar-name">{user?.fullName?.split(' ')[0] || 'User'}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`navbar__avatar-chevron ${userMenuOpen ? 'open' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="navbar__user-dropdown animate-fade-in" id="navbar-user-dropdown">
                    <div className="navbar__dropdown-header">
                      <div className="navbar__dh-name">{user?.fullName || 'Student User'}</div>
                      <div className="navbar__dh-email">{user?.email || ''}</div>
                    </div>
                    <div className="navbar__dropdown-sep" />
                    <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <span>📊</span> Dashboard
                    </Link>
                    <Link to="/goals" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <span>🎯</span> Preparation Goals
                    </Link>
                    <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <span>👤</span> My Profile
                    </Link>
                    <div className="navbar__dropdown-sep" />
                    <button className="navbar__dropdown-item navbar__dropdown-logout" onClick={handleLogout}>
                      <span>🚪</span> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" id="navbar-login-btn">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" id="navbar-signup-btn">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          id="navbar-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu${menuOpen ? ' navbar__mobile-menu--open' : ''}`} id="navbar-mobile-menu">
        <nav aria-label="Mobile navigation">
          {isAuthenticated ? (
            <>
              <div className="navbar__mobile-user-card">
                <div className="navbar__avatar-circle large">
                  {user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt={user.fullName || 'User'} className="navbar__avatar-img" />
                  ) : (
                    user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div>
                  <div className="navbar__dh-name">{user?.fullName || 'Student User'}</div>
                  <div className="navbar__dh-email">{user?.email || ''}</div>
                </div>
              </div>
              <Link to="/dashboard" className="navbar__mobile-link">Dashboard</Link>
              <Link to="/goals" className="navbar__mobile-link">Goals</Link>
              <Link to="/profile" className="navbar__mobile-link">Profile</Link>
              <div className="navbar__mobile-actions">
                <button onClick={toggleTheme} className="btn btn-outline" id="mobile-theme-btn">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
                <button onClick={handleLogout} className="btn btn-ghost" id="mobile-logout-btn">Log out</button>
              </div>
            </>
          ) : (
            <>
              <a href="#features" className="navbar__mobile-link">Features</a>
              <a href="#how-it-works" className="navbar__mobile-link">How it Works</a>
              <a href="#roadmap" className="navbar__mobile-link">Roadmap</a>
              <div className="navbar__mobile-actions">
                <button onClick={toggleTheme} className="btn btn-outline" id="mobile-theme-btn">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
                <Link to="/login" className="btn btn-outline" id="mobile-login-btn">Log in</Link>
                <Link to="/signup" className="btn btn-primary" id="mobile-signup-btn">Get Started</Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
