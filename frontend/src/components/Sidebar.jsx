import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import './Sidebar.css';

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

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

  const [roadmapsOpen, setRoadmapsOpen] = useState(true);
  const [careerOpen, setCareerOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside className={`app-sidebar ${collapsed ? 'app-sidebar--collapsed' : ''} ${mobileOpen ? 'app-sidebar--mobile-open' : ''}`}>
        {/* Header: Logo + Collapse Toggle */}
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-logo" onClick={onCloseMobile} title="PrepPal Home">
            <div className="sidebar-logo-badge">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#2563eb" />
                <path d="M7 20L11 8l6 9 3-5 3 8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {!collapsed && <span className="sidebar-logo-text">PrepPal</span>}
          </NavLink>

          <button
            onClick={onToggle}
            className="sidebar-collapse-btn"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-nav-container">
          {/* Section 1: Core Workspace */}
          <div className="sidebar-group">
            <div className="sidebar-group-header">
              <span>Workspace</span>
            </div>

            <nav className="sidebar-nav-list" aria-label="Core Navigation">
              {/* Dashboard */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
                onClick={onCloseMobile}
              >
                <span className="sidebar-nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </span>
                {!collapsed && <span className="sidebar-nav-label">Dashboard</span>}
              </NavLink>

              {/* Preparation Goals */}
              <NavLink
                to="/goals"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
                onClick={onCloseMobile}
              >
                <span className="sidebar-nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </span>
                {!collapsed && <span className="sidebar-nav-label">Preparation Goals</span>}
              </NavLink>

              {/* Schedule */}
              <NavLink
                to="/schedule"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
                onClick={onCloseMobile}
              >
                <span className="sidebar-nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                {!collapsed && <span className="sidebar-nav-label">Schedule</span>}
              </NavLink>

              {/* Student Profile */}
              <NavLink
                to="/profile"
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
                onClick={onCloseMobile}
              >
                <span className="sidebar-nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                {!collapsed && <span className="sidebar-nav-label">Student Profile</span>}
              </NavLink>
            </nav>
          </div>

          {/* Section 2: Preparation & Learning */}
          <div className="sidebar-group">
            <div className="sidebar-group-header">
              <span>Learning Paths</span>
            </div>

            <nav className="sidebar-nav-list" aria-label="Learning Navigation">
              {/* Roadmaps (Collapsible with branch connector) */}
              <div className="sidebar-nested-group">
                <button
                  onClick={() => setRoadmapsOpen(prev => !prev)}
                  className="sidebar-nav-item sidebar-nav-item--expandable"
                >
                  <span className="sidebar-nav-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </span>
                  {!collapsed && (
                    <>
                      <span className="sidebar-nav-label">Track Roadmaps</span>
                      <span className={`sidebar-chevron ${roadmapsOpen ? 'sidebar-chevron--open' : ''}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </>
                  )}
                </button>

                {!collapsed && roadmapsOpen && (
                  <div className="sidebar-sub-items">
                    <NavLink to="/goals" className="sidebar-sub-item" onClick={onCloseMobile}>DSA & Problem Solving</NavLink>
                    <NavLink to="/goals" className="sidebar-sub-item" onClick={onCloseMobile}>Backend Engineering</NavLink>
                    <NavLink to="/goals" className="sidebar-sub-item" onClick={onCloseMobile}>Core CS & DBMS</NavLink>
                    <NavLink to="/goals" className="sidebar-sub-item" onClick={onCloseMobile}>System Design</NavLink>
                  </div>
                )}
              </div>

              {/* Resource Hub */}
              <NavLink
                to="/goals"
                className="sidebar-nav-item"
                onClick={onCloseMobile}
              >
                <span className="sidebar-nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                {!collapsed && <span className="sidebar-nav-label">Resource Hub</span>}
              </NavLink>

              {/* Revision Notes */}
              <NavLink
                to="/goals"
                className="sidebar-nav-item"
                onClick={onCloseMobile}
              >
                <span className="sidebar-nav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </span>
                {!collapsed && <span className="sidebar-nav-label">Revision Notes</span>}
              </NavLink>
            </nav>
          </div>

          {/* Section 3: Career & Placement */}
          {!collapsed && (
            <div className="sidebar-group">
              <button
                onClick={() => setCareerOpen(prev => !prev)}
                className="sidebar-group-header sidebar-group-header--btn"
              >
                <span>Career & Placement</span>
                <span className={`sidebar-chevron ${careerOpen ? 'sidebar-chevron--open' : ''}`}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </button>
              {careerOpen && (
                <div className="sidebar-sub-items">
                  <NavLink to="/profile" className="sidebar-sub-item" onClick={onCloseMobile}>Target Companies</NavLink>
                  <a
                    href="#ai-interview"
                    className="sidebar-sub-item"
                    onClick={(e) => { e.preventDefault(); navigate('/dashboard'); onCloseMobile?.(); }}
                  >
                    AI Mock Interview <span style={{ fontSize: '0.625rem', padding: '1px 4px', borderRadius: '3px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-600)', marginLeft: '4px' }}>AI</span>
                  </a>
                  <a
                    href="#readiness"
                    className="sidebar-sub-item"
                    onClick={(e) => { e.preventDefault(); navigate('/dashboard'); onCloseMobile?.(); }}
                  >
                    Readiness Score
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: User Profile Card */}
        <div className="sidebar-footer">
          <div className="sidebar-profile-card">
            <div className="sidebar-avatar" title={user?.fullName || 'Student'}>
              {user?.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.fullName || 'Student'} className="sidebar-avatar-img" />
              ) : (
                (user?.fullName || 'S').charAt(0).toUpperCase()
              )}
            </div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-username">{user?.fullName || 'Student'}</span>
                <span className="sidebar-userbadge">{user?.role || 'STUDENT'}</span>
              </div>
            )}
            {!collapsed && (
              <NavLink to="/profile" className="sidebar-upgrade-btn" title="View Profile">
                <span>Profile</span>
              </NavLink>
            )}
          </div>
          {!collapsed && (
            <div className="sidebar-logout-row">
              <button onClick={handleLogout} className="sidebar-logout-btn" title="Log out">
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
