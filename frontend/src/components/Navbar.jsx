import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

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
          <a href="#features" className="navbar__link">Features</a>
          <a href="#how-it-works" className="navbar__link">How it Works</a>
          <a href="#roadmap" className="navbar__link">Roadmap</a>
        </nav>

        {/* CTA Buttons */}
        <div className="navbar__actions">
          <Link to="/login" className="btn btn-ghost btn-sm" id="navbar-login-btn">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm" id="navbar-signup-btn">
            Get Started
          </Link>
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
          <a href="#features" className="navbar__mobile-link">Features</a>
          <a href="#how-it-works" className="navbar__mobile-link">How it Works</a>
          <a href="#roadmap" className="navbar__mobile-link">Roadmap</a>
          <div className="navbar__mobile-actions">
            <Link to="/login" className="btn btn-outline" id="mobile-login-btn">Log in</Link>
            <Link to="/signup" className="btn btn-primary" id="mobile-signup-btn">Get Started</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
