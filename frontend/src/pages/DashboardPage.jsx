import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getToken, logout } from '../services/authService';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getCurrentUser();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) {
    return null;
  }

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.fullName || 'Student'}!</h1>
            <p className="dashboard-subtitle">Here is your PrepPal learning and interview preparation workspace.</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            id="dashboard-logout-btn"
          >
            Log Out
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2 className="dashboard-card__title">Profile Information</h2>
            <div className="dashboard-card__detail">
              <span className="dashboard-card__label">Full Name:</span>
              <span className="dashboard-card__value">{user?.fullName || 'N/A'}</span>
            </div>
            <div className="dashboard-card__detail">
              <span className="dashboard-card__label">Email Address:</span>
              <span className="dashboard-card__value">{user?.email || 'N/A'}</span>
            </div>
            <div className="dashboard-card__detail">
              <span className="dashboard-card__label">Account Role:</span>
              <span className="badge badge-primary">{user?.role || 'STUDENT'}</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="dashboard-card__title">Account Status</h2>
            <p className="dashboard-card__status">
              <span className="status-dot" aria-hidden="true"></span>
              Secure Session Active
            </p>
            <p className="dashboard-card__description">
              JWT token successfully stored and verified. You are connected to the PrepPal backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
