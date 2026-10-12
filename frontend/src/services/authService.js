/**
 * Authentication service for communicating with the PrepPal backend API.
 * Reads the API base URL from VITE_API_BASE_URL, defaulting to http://localhost:8080.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const AUTH_TOKEN_KEY = 'preppal_token';
export const AUTH_USER_KEY = 'preppal_user';

/**
 * Register a new student account.
 * @param {{ fullName: string, email: string, password: string }} credentials
 * @returns {Promise<{ token: string, id: string, fullName: string, email: string, role: string }>}
 */
export async function register({ fullName, email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fullName, email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Registration failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Log into an existing account.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, id: string, fullName: string, email: string, role: string }>}
 */
export async function login({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Login failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Store JWT and user details in localStorage.
 */
export function saveAuth(authData) {
  if (!authData) return;
  if (authData.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
  }
  const user = {
    id: authData.id,
    fullName: authData.fullName,
    email: authData.email,
    role: authData.role,
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/**
 * Get stored JWT.
 */
export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get current stored user profile.
 */
export function getCurrentUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear stored auth credentials.
 */
export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
