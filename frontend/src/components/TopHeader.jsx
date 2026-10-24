import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './TopHeader.css';

export default function TopHeader({ onToggleMobileSidebar }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('preppal_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preppal_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="top-header" id="app-top-header">
      <div className="top-header-left">
        <button
          onClick={onToggleMobileSidebar}
          className="top-header-hamburger"
          aria-label="Toggle navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Quick search input */}
        <div className="top-header-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search or press ⌘K..." className="top-search-input" />
        </div>
      </div>

      <div className="top-header-right">
        {/* Coins Badge */}
        <div className="header-stat-pill" title="Preparation Coins">
          <span className="stat-pill-icon">🪙</span>
          <span className="stat-pill-val">50</span>
        </div>

        {/* Streak Badge */}
        <div className="header-stat-pill" title="Daily Problem Streak">
          <span className="stat-pill-icon">🔥</span>
          <span className="stat-pill-val">0</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="header-theme-toggle"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Quick Action Pill */}
        <NavLink to="/goals" className="header-plus-btn" title="Create preparation goal">
          <span>+ New Goal</span>
        </NavLink>
      </div>
    </header>
  );
}
