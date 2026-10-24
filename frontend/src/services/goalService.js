import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function authenticatedFetch(url, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated. Please log in.');
  }

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let message = data.message || `Request failed with status ${response.status}`;
    if (data.fieldErrors) {
      const details = Object.entries(data.fieldErrors)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      message = `${message} (${details})`;
    }
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* ── Goal Operations ────────────────────────────────────────── */

export async function getGoals() {
  return authenticatedFetch('/api/v1/goals');
}

export async function getGoal(goalId) {
  return authenticatedFetch(`/api/v1/goals/${goalId}`);
}

export async function createGoal(goalData) {
  return authenticatedFetch('/api/v1/goals', {
    method: 'POST',
    body: goalData
  });
}

export async function updateGoal(goalId, goalData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}`, {
    method: 'PUT',
    body: goalData
  });
}

export async function updateGoalStatus(goalId, status) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/status`, {
    method: 'PATCH',
    body: { status }
  });
}

export async function updateGoalNotes(goalId, notes) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/notes`, {
    method: 'PATCH',
    body: { notes }
  });
}

export async function deleteGoal(goalId) {
  return authenticatedFetch(`/api/v1/goals/${goalId}`, {
    method: 'DELETE'
  });
}

/* ── Topic Operations ───────────────────────────────────────── */

export async function addTopic(goalId, topicData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics`, {
    method: 'POST',
    body: topicData
  });
}

export async function updateTopic(goalId, topicId, topicData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}`, {
    method: 'PUT',
    body: topicData
  });
}

export async function updateTopicNotes(goalId, topicId, notes) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/notes`, {
    method: 'PATCH',
    body: { notes }
  });
}

export async function deleteTopic(goalId, topicId) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}`, {
    method: 'DELETE'
  });
}

/* ── Subtopic Operations ────────────────────────────────────── */

export async function addSubtopic(goalId, topicId, subtopicData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics`, {
    method: 'POST',
    body: subtopicData
  });
}

export async function addSubSubtopic(goalId, topicId, subtopicId, subtopicData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}/subtopics`, {
    method: 'POST',
    body: subtopicData
  });
}

export async function updateSubtopic(goalId, topicId, subtopicId, subtopicData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}`, {
    method: 'PUT',
    body: subtopicData
  });
}

export async function toggleSubtopic(goalId, topicId, subtopicId, completed) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}/toggle`, {
    method: 'PATCH',
    body: { completed }
  });
}

export async function updateSubtopicNotes(goalId, topicId, subtopicId, notes) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}/notes`, {
    method: 'PATCH',
    body: { notes }
  });
}

export async function deleteSubtopic(goalId, topicId, subtopicId) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}`, {
    method: 'DELETE'
  });
}

/* ── Resources at all 3 Levels ──────────────────────────────── */

// 1. Goal level resources
export async function addGoalResource(goalId, resourceData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/resources`, {
    method: 'POST',
    body: resourceData
  });
}

export async function updateGoalResource(goalId, resourceId, resourceData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/resources/${resourceId}`, {
    method: 'PUT',
    body: resourceData
  });
}

export async function deleteGoalResource(goalId, resourceId) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/resources/${resourceId}`, {
    method: 'DELETE'
  });
}

// 2. Topic level resources
export async function addTopicResource(goalId, topicId, resourceData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/resources`, {
    method: 'POST',
    body: resourceData
  });
}

export async function updateTopicResource(goalId, topicId, resourceId, resourceData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/resources/${resourceId}`, {
    method: 'PUT',
    body: resourceData
  });
}

export async function deleteTopicResource(goalId, topicId, resourceId) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/resources/${resourceId}`, {
    method: 'DELETE'
  });
}

// 3. Subtopic level resources
export async function addSubtopicResource(goalId, topicId, subtopicId, resourceData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}/resources`, {
    method: 'POST',
    body: resourceData
  });
}

export async function updateSubtopicResource(goalId, topicId, subtopicId, resourceId, resourceData) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}/resources/${resourceId}`, {
    method: 'PUT',
    body: resourceData
  });
}

export async function deleteSubtopicResource(goalId, topicId, subtopicId, resourceId) {
  return authenticatedFetch(`/api/v1/goals/${goalId}/topics/${topicId}/subtopics/${subtopicId}/resources/${resourceId}`, {
    method: 'DELETE'
  });
}
