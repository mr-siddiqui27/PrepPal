import { getToken, AUTH_USER_KEY } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Fetch the authenticated student's profile.
 * @returns {Promise<import('./profileService').ProfileResponse>}
 */
export async function getProfile() {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/profile/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch student profile.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (data && data.profilePictureUrl !== undefined) {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        if (user.profilePictureUrl !== data.profilePictureUrl) {
          user.profilePictureUrl = data.profilePictureUrl || null;
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
          window.dispatchEvent(new CustomEvent('preppal-user-updated', { detail: user }));
        }
      } catch {
        // ignore
      }
    }
  }

  return data;
}

/**
 * Create or update the authenticated student's profile.
 * @param {Object} profileData
 * @returns {Promise<import('./profileService').ProfileResponse>}
 */
export async function updateProfile(profileData) {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/profile/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let message = data.message || 'Failed to update profile.';
    if (data.fieldErrors) {
      const errorList = Object.entries(data.fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');
      message = `${message} (${errorList})`;
    }
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  // Update cached full name and profile picture in localStorage
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (rawUser) {
    try {
      const user = JSON.parse(rawUser);
      if (data.fullName) {
        user.fullName = data.fullName;
      }
      user.profilePictureUrl = data.profilePictureUrl || null;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('preppal-user-updated', { detail: user }));
    } catch {
      // ignore JSON parse error
    }
  }

  return data;
}
