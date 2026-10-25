import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function authenticatedFetch(url, options = {}) {
  const token = getToken();
  if (!token) throw new Error('Not authenticated. Please log in.');

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.message || `Request failed with status ${response.status}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* ── Schedule Activity Operations ─────────────────────────── */

/**
 * Get activities for a date range.
 * @param {string} startDate  ISO date string (YYYY-MM-DD)
 * @param {string} endDate    ISO date string (YYYY-MM-DD)
 */
export async function getActivitiesForRange(startDate, endDate) {
  return authenticatedFetch(`/api/v1/schedule?startDate=${startDate}&endDate=${endDate}`);
}

/**
 * Get activities for a single day.
 * @param {string} date  ISO date string (YYYY-MM-DD)
 */
export async function getActivitiesForDay(date) {
  return authenticatedFetch(`/api/v1/schedule/day?date=${date}`);
}

/**
 * Create a new scheduled activity (may expand recurrence into multiple).
 * @param {Object} activityData
 */
export async function createActivity(activityData) {
  return authenticatedFetch('/api/v1/schedule', {
    method: 'POST',
    body: activityData
  });
}

/**
 * Update a scheduled activity fully.
 * @param {string} id
 * @param {Object} activityData
 */
export async function updateActivity(id, activityData) {
  return authenticatedFetch(`/api/v1/schedule/${id}`, {
    method: 'PUT',
    body: activityData
  });
}

/**
 * Update only the status of an activity.
 * @param {string} id
 * @param {string} status  PLANNED | IN_PROGRESS | COMPLETED | SKIPPED
 */
export async function updateActivityStatus(id, status) {
  return authenticatedFetch(`/api/v1/schedule/${id}/status`, {
    method: 'PATCH',
    body: { status }
  });
}

/**
 * Delete a scheduled activity.
 * @param {string} id
 */
export async function deleteActivity(id) {
  return authenticatedFetch(`/api/v1/schedule/${id}`, {
    method: 'DELETE'
  });
}
