import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import { getProfile, updateProfile } from '../services/profileService';
import './ProfilePage.css';

/**
 * Helper to convert comma-separated string to array of trimmed non-empty strings.
 */
function parseCommaSeparated(val) {
  if (Array.isArray(val)) return val;
  if (!val || typeof val !== 'string') return [];
  return val
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Helper to format array back to comma-separated string for editing.
 */
function toCommaSeparated(arr) {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(', ');
}

const AVATAR_PRESETS = [
  { name: 'Alex', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { name: 'Felix', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { name: 'Aneka', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { name: 'Sarah', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { name: 'Dev Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PrepPalBot' },
  { name: 'Tech Cat', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberTech' },
];

function formatFormData(data) {
  if (!data) return {};
  return {
    fullName: data.fullName || '',
    collegeName: data.collegeName || '',
    degree: data.degree || '',
    branch: data.branch || '',
    graduationYear: data.graduationYear || '',
    programmingLanguages: toCommaSeparated(data.programmingLanguages),
    technicalSkills: toCommaSeparated(data.technicalSkills),
    frameworksAndTechnologies: toCommaSeparated(data.frameworksAndTechnologies),
    databasesAndTools: toCommaSeparated(data.databasesAndTools),
    careerGoal: data.careerGoal || '',
    preferredJobRoles: toCommaSeparated(data.preferredJobRoles),
    careerInterests: toCommaSeparated(data.careerInterests),
    targetCompanies: toCommaSeparated(data.targetCompanies),
    preferredTechnologies: toCommaSeparated(data.preferredTechnologies),
    profilePictureUrl: data.profilePictureUrl || '',
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = getToken();

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Guard: Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Load profile on mount
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    getProfile()
      .then(data => {
        if (!isMounted) return;
        setProfile(data);
        setFormData(formatFormData(data));
      })
      .catch(err => {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Could not load your profile. Please check your connection.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    if (profile) setFormData(formatFormData(profile));
    setIsEditing(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleCancelClick = () => {
    if (profile) setFormData(formatFormData(profile));
    setIsEditing(false);
    setErrorMessage('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 320;
        const MAX_HEIGHT = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, profilePictureUrl: dataUrl }));
        setSuccessMessage('Photo selected! Click "Save Changes" to apply.');
      };
      img.onerror = () => {
        setErrorMessage('Failed to process image.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Prepare payload
    const payload = {
      fullName: formData.fullName?.trim() || null,
      profilePictureUrl: formData.profilePictureUrl?.trim() || null,
      collegeName: formData.collegeName?.trim() || null,
      degree: formData.degree?.trim() || null,
      branch: formData.branch?.trim() || null,
      graduationYear: formData.graduationYear ? parseInt(formData.graduationYear, 10) : null,
      programmingLanguages: parseCommaSeparated(formData.programmingLanguages),
      technicalSkills: parseCommaSeparated(formData.technicalSkills),
      frameworksAndTechnologies: parseCommaSeparated(formData.frameworksAndTechnologies),
      databasesAndTools: parseCommaSeparated(formData.databasesAndTools),
      careerGoal: formData.careerGoal?.trim() || null,
      preferredJobRoles: parseCommaSeparated(formData.preferredJobRoles),
      careerInterests: parseCommaSeparated(formData.careerInterests),
      targetCompanies: parseCommaSeparated(formData.targetCompanies),
      preferredTechnologies: parseCommaSeparated(formData.preferredTechnologies),
    };

    // Client-side quick checks
    if (payload.graduationYear && (payload.graduationYear < 1990 || payload.graduationYear > 2100)) {
      setErrorMessage('Expected graduation year must be between 1990 and 2100.');
      setSaving(false);
      return;
    }

    try {
      const updated = await updateProfile(payload);
      setProfile(updated);
      setFormData(formatFormData(updated));
      setIsEditing(false);
      setSuccessMessage('Profile saved successfully!');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container profile-container">
          <div className="profile-loading" id="profile-loading">
            <div className="spinner" aria-label="Loading profile..."></div>
            <p className="text-secondary font-medium">Loading your student profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const initials = profile?.fullName
    ? profile.fullName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SP';

  const renderChips = (list, colorClass = '') => {
    if (!list || list.length === 0) {
      return <span className="profile-field-value--muted">Not added yet</span>;
    }
    return (
      <div className="profile-chips">
        {list.map((item, idx) => (
          <span key={idx} className={`chip ${colorClass}`}>{item}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="profile-page" id="student-profile-page">
      <div className="container profile-container">
        {/* Alerts */}
        {successMessage && (
          <div className="profile-alert profile-alert--success" role="alert" id="profile-success-alert">
            <span>✓ {successMessage}</span>
            <button
              className="profile-alert__close"
              onClick={() => setSuccessMessage('')}
              aria-label="Dismiss success message"
            >
              &times;
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="profile-alert profile-alert--error" role="alert" id="profile-error-alert">
            <span>⚠ {errorMessage}</span>
            <button
              className="profile-alert__close"
              onClick={() => setErrorMessage('')}
              aria-label="Dismiss error message"
            >
              &times;
            </button>
          </div>
        )}

        {/* Empty state nudge if profile is incomplete and in view mode */}
        {!isEditing && profile && !profile.isCompleted && (
          <div className="profile-empty-banner" id="profile-empty-banner">
            <div className="profile-empty-banner__text">
              <h3>Complete your Student Profile</h3>
              <p>Add your college, technical skills, and career preferences to unlock personalized roadmaps and interview preparation.</p>
            </div>
            <button
              onClick={handleEditClick}
              className="btn btn-primary btn-sm"
              id="profile-complete-now-btn"
            >
              Complete Profile Now
            </button>
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header__identity">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar" aria-hidden="true">
                {profile?.profilePictureUrl ? (
                  <img
                    src={profile.profilePictureUrl}
                    alt={profile.fullName || 'Student'}
                    className="profile-avatar-img"
                  />
                ) : (
                  initials
                )}
              </div>
              {!isEditing && (
                <button
                  type="button"
                  className="profile-avatar-badge-btn"
                  onClick={handleEditClick}
                  title="Change profile photo"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="profile-title-group">
              <h1 id="profile-display-name">{profile?.fullName || 'Student'}</h1>
              <div className="profile-header__meta">
                <span id="profile-display-email">{profile?.email}</span>
                <span>•</span>
                <span
                  className={`badge ${profile?.isCompleted ? 'badge-completed' : 'badge-incomplete'}`}
                  id="profile-status-badge"
                >
                  {profile?.isCompleted ? 'Profile Complete' : 'Profile Incomplete'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-header__actions">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditClick}
                className="btn btn-primary"
                id="profile-edit-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="btn btn-ghost"
                  disabled={saving}
                  id="profile-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  className="btn btn-primary"
                  disabled={saving}
                  id="profile-save-btn"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Form Mode vs View Mode */}
        {isEditing ? (
          <form id="profile-form" onSubmit={handleSubmit} className="profile-grid">
            {/* Profile Photo Section */}
            <div className="profile-section-card profile-section-card--full" id="profile-photo-card">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div>
                  <h2 className="profile-section-title">Profile Photo</h2>
                  <p className="profile-section-subtitle">Upload your picture or select a developer avatar</p>
                </div>
              </div>

              <div className="profile-photo-editor">
                <div className="profile-photo-preview-wrap">
                  <div className="profile-photo-preview">
                    {formData.profilePictureUrl ? (
                      <img
                        src={formData.profilePictureUrl}
                        alt="Profile preview"
                        className="profile-photo-img"
                      />
                    ) : (
                      <span className="profile-photo-initials">{initials}</span>
                    )}
                  </div>
                  {formData.profilePictureUrl && (
                    <button
                      type="button"
                      className="btn-remove-photo"
                      onClick={() => setFormData(prev => ({ ...prev, profilePictureUrl: '' }))}
                      title="Remove profile photo"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="profile-photo-controls">
                  <div className="profile-photo-actions-row">
                    <label className="btn btn-outline btn-sm profile-upload-btn" htmlFor="profile-file-input">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload Photo
                      <input
                        id="profile-file-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </label>
                    <span className="profile-photo-hint">Supports PNG, JPG, WebP up to 5MB</span>
                  </div>

                  <div className="profile-photo-url-wrap">
                    <label htmlFor="profilePictureUrl" className="profile-form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                      Or paste direct image URL
                    </label>
                    <input
                      id="profilePictureUrl"
                      name="profilePictureUrl"
                      type="url"
                      value={formData.profilePictureUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/... or https://github.com/username.png"
                      className="profile-input profile-input--sm"
                    />
                  </div>

                  <div className="profile-presets-row">
                    <span className="profile-presets-label">Or choose an avatar:</span>
                    <div className="profile-preset-list">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`profile-preset-btn ${formData.profilePictureUrl === preset.url ? 'profile-preset-btn--active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, profilePictureUrl: preset.url }))}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} width="32" height="32" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information (Editable name, read-only email) */}
            <div className="profile-section-card profile-section-card--full">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h2 className="profile-section-title">Personal Information</h2>
              </div>
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label htmlFor="fullName" className="profile-form-label">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="profile-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="email" className="profile-form-label">Registered Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile?.email || ''}
                    readOnly
                    className="profile-input"
                    title="Registered email cannot be modified from profile."
                  />
                  <span className="profile-form-hint">Associated with your account (read-only)</span>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="profile-section-card">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h2 className="profile-section-title">Academic Information</h2>
              </div>
              <div className="profile-form-grid">
                <div className="profile-form-group profile-form-group--full">
                  <label htmlFor="collegeName" className="profile-form-label">College / University Name</label>
                  <input
                    id="collegeName"
                    name="collegeName"
                    type="text"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    placeholder="e.g. Stanford University"
                    className="profile-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="degree" className="profile-form-label">Degree</label>
                  <input
                    id="degree"
                    name="degree"
                    type="text"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="e.g. B.Tech, B.S., M.S."
                    className="profile-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="branch" className="profile-form-label">Branch / Specialization</label>
                  <input
                    id="branch"
                    name="branch"
                    type="text"
                    value={formData.branch}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science and Engineering"
                    className="profile-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="graduationYear" className="profile-form-label">Expected Graduation Year</label>
                  <input
                    id="graduationYear"
                    name="graduationYear"
                    type="number"
                    min="1990"
                    max="2100"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    placeholder="e.g. 2026"
                    className="profile-input"
                  />
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="profile-section-card">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <h2 className="profile-section-title">Technical Skills</h2>
              </div>
              <div className="profile-form-grid">
                <div className="profile-form-group profile-form-group--full">
                  <label htmlFor="programmingLanguages" className="profile-form-label">Programming Languages</label>
                  <input
                    id="programmingLanguages"
                    name="programmingLanguages"
                    type="text"
                    value={formData.programmingLanguages}
                    onChange={handleInputChange}
                    placeholder="e.g. Java, Python, TypeScript, C++"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Separate multiple items with commas</span>
                </div>
                <div className="profile-form-group profile-form-group--full">
                  <label htmlFor="technicalSkills" className="profile-form-label">Technical Skills</label>
                  <input
                    id="technicalSkills"
                    name="technicalSkills"
                    type="text"
                    value={formData.technicalSkills}
                    onChange={handleInputChange}
                    placeholder="e.g. Data Structures & Algorithms, System Design, REST APIs"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Separate multiple items with commas</span>
                </div>
                <div className="profile-form-group profile-form-group--full">
                  <label htmlFor="frameworksAndTechnologies" className="profile-form-label">Frameworks & Technologies</label>
                  <input
                    id="frameworksAndTechnologies"
                    name="frameworksAndTechnologies"
                    type="text"
                    value={formData.frameworksAndTechnologies}
                    onChange={handleInputChange}
                    placeholder="e.g. Spring Boot, React, Node.js"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Separate multiple items with commas</span>
                </div>
                <div className="profile-form-group profile-form-group--full">
                  <label htmlFor="databasesAndTools" className="profile-form-label">Databases & Tools</label>
                  <input
                    id="databasesAndTools"
                    name="databasesAndTools"
                    type="text"
                    value={formData.databasesAndTools}
                    onChange={handleInputChange}
                    placeholder="e.g. MongoDB, PostgreSQL, Git, Docker"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Separate multiple items with commas</span>
                </div>
              </div>
            </div>

            {/* Career Preferences */}
            <div className="profile-section-card profile-section-card--full">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                  </svg>
                </div>
                <h2 className="profile-section-title">Career Preferences</h2>
              </div>
              <div className="profile-form-grid">
                <div className="profile-form-group profile-form-group--full">
                  <label htmlFor="careerGoal" className="profile-form-label">Career Goal</label>
                  <textarea
                    id="careerGoal"
                    name="careerGoal"
                    value={formData.careerGoal}
                    onChange={handleInputChange}
                    placeholder="e.g. Land a Full Stack Engineer role at a fast-growing tech product company within 6 months."
                    className="profile-textarea"
                  />
                </div>
                <div className="profile-form-group">
                  <label htmlFor="preferredJobRoles" className="profile-form-label">Preferred Job Roles</label>
                  <input
                    id="preferredJobRoles"
                    name="preferredJobRoles"
                    type="text"
                    value={formData.preferredJobRoles}
                    onChange={handleInputChange}
                    placeholder="e.g. Backend Developer, Full Stack Engineer"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Comma-separated</span>
                </div>
                <div className="profile-form-group">
                  <label htmlFor="careerInterests" className="profile-form-label">Career Interests</label>
                  <input
                    id="careerInterests"
                    name="careerInterests"
                    type="text"
                    value={formData.careerInterests}
                    onChange={handleInputChange}
                    placeholder="e.g. Cloud Computing, Distributed Systems, AI Engineering"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Comma-separated</span>
                </div>
                <div className="profile-form-group">
                  <label htmlFor="targetCompanies" className="profile-form-label">Target Companies</label>
                  <input
                    id="targetCompanies"
                    name="targetCompanies"
                    type="text"
                    value={formData.targetCompanies}
                    onChange={handleInputChange}
                    placeholder="e.g. Google, Microsoft, Amazon, Atlassian"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Comma-separated</span>
                </div>
                <div className="profile-form-group">
                  <label htmlFor="preferredTechnologies" className="profile-form-label">Preferred Technologies</label>
                  <input
                    id="preferredTechnologies"
                    name="preferredTechnologies"
                    type="text"
                    value={formData.preferredTechnologies}
                    onChange={handleInputChange}
                    placeholder="e.g. Java, React, Kubernetes, AWS"
                    className="profile-input"
                  />
                  <span className="profile-form-hint">Comma-separated</span>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="profile-grid">
            {/* Academic Information Card */}
            <div className="profile-section-card">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h2 className="profile-section-title">Academic Information</h2>
              </div>
              <div className="profile-fields-list">
                <div className="profile-field-row">
                  <span className="profile-field-label">College / University</span>
                  <span className={`profile-field-value ${!profile?.collegeName ? 'profile-field-value--muted' : ''}`} id="profile-view-college">
                    {profile?.collegeName || 'Not specified'}
                  </span>
                </div>
                <div className="profile-field-row">
                  <span className="profile-field-label">Degree</span>
                  <span className={`profile-field-value ${!profile?.degree ? 'profile-field-value--muted' : ''}`} id="profile-view-degree">
                    {profile?.degree || 'Not specified'}
                  </span>
                </div>
                <div className="profile-field-row">
                  <span className="profile-field-label">Branch / Specialization</span>
                  <span className={`profile-field-value ${!profile?.branch ? 'profile-field-value--muted' : ''}`} id="profile-view-branch">
                    {profile?.branch || 'Not specified'}
                  </span>
                </div>
                <div className="profile-field-row">
                  <span className="profile-field-label">Expected Graduation Year</span>
                  <span className={`profile-field-value ${!profile?.graduationYear ? 'profile-field-value--muted' : ''}`} id="profile-view-graduation-year">
                    {profile?.graduationYear || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Skills Card */}
            <div className="profile-section-card">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <h2 className="profile-section-title">Technical Skills</h2>
              </div>
              <div className="profile-fields-list">
                <div className="profile-field-row">
                  <span className="profile-field-label">Programming Languages</span>
                  {renderChips(profile?.programmingLanguages, 'chip--primary')}
                </div>
                <div className="profile-field-row">
                  <span className="profile-field-label">Technical Skills</span>
                  {renderChips(profile?.technicalSkills)}
                </div>
                <div className="profile-field-row">
                  <span className="profile-field-label">Frameworks & Technologies</span>
                  {renderChips(profile?.frameworksAndTechnologies, 'chip--accent')}
                </div>
                <div className="profile-field-row">
                  <span className="profile-field-label">Databases & Tools</span>
                  {renderChips(profile?.databasesAndTools)}
                </div>
              </div>
            </div>

            {/* Career Preferences Card */}
            <div className="profile-section-card profile-section-card--full">
              <div className="profile-section-header">
                <div className="profile-section-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                  </svg>
                </div>
                <h2 className="profile-section-title">Career Preferences</h2>
              </div>
              <div className="profile-fields-list">
                <div className="profile-field-row">
                  <span className="profile-field-label">Career Goal</span>
                  <p className={`profile-field-value ${!profile?.careerGoal ? 'profile-field-value--muted' : ''}`} id="profile-view-career-goal">
                    {profile?.careerGoal || 'No career goal defined yet.'}
                  </p>
                </div>
                <div className="profile-form-grid" style={{ marginTop: 'var(--space-2)' }}>
                  <div className="profile-field-row">
                    <span className="profile-field-label">Preferred Job Roles</span>
                    {renderChips(profile?.preferredJobRoles, 'chip--primary')}
                  </div>
                  <div className="profile-field-row">
                    <span className="profile-field-label">Career Interests</span>
                    {renderChips(profile?.careerInterests)}
                  </div>
                  <div className="profile-field-row">
                    <span className="profile-field-label">Target Companies</span>
                    {renderChips(profile?.targetCompanies, 'chip--accent')}
                  </div>
                  <div className="profile-field-row">
                    <span className="profile-field-label">Preferred Technologies</span>
                    {renderChips(profile?.preferredTechnologies)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
