import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getActivitiesForRange,
  createActivity,
  updateActivity,
  updateActivityStatus,
  deleteActivity,
} from '../services/scheduleService';
import { getGoals } from '../services/goalService';
import './SchedulePage.css';

/* ── Utility helpers ─────────────────────────────────────────── */

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // Monday as first day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
}

function formatWeekRange(weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const opts = { month: 'short', day: 'numeric' };
  const startStr = weekStart.toLocaleDateString('en-US', opts);
  const endStr = weekEnd.toLocaleDateString('en-US', {
    month: weekStart.getMonth() === weekEnd.getMonth() ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STATUS_OPTIONS = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'];
const STATUS_LABELS = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  SKIPPED: 'Skipped',
};
const STATUS_COLORS = {
  PLANNED: '#6366f1',
  IN_PROGRESS: '#f59e0b',
  COMPLETED: '#10b981',
  SKIPPED: '#94a3b8',
};
const CATEGORIES = ['DSA', 'Backend', 'System Design', 'Interview Prep', 'Core CS', 'Study', 'Break', 'Personal', 'Other'];

/* ── Default form state ─────────────────────────────────────── */
const defaultForm = {
  title: '',
  description: '',
  scheduledDate: toISODate(new Date()),
  startTime: '',
  endTime: '',
  durationMinutes: '',
  activityType: 'PERSONAL',
  status: 'PLANNED',
  category: '',
  priority: 'MEDIUM',
  linkedGoalId: '',
  linkedGoalTitle: '',
  linkedTopicId: '',
  linkedTopicTitle: '',
  navigationPath: '',
  recurrence: 'NONE',
  recurrenceEndDate: '',
};

/* ═══════════════════════════════════════════════════════════════
   SchedulePage Component
   ═══════════════════════════════════════════════════════════════ */
export default function SchedulePage() {
  const navigate = useNavigate();

  /* ── View state ─────────────────────────────────────────────── */
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'day'
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const weekDays = getWeekDays(weekStart);

  /* ── Data state ─────────────────────────────────────────────── */
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Modal state ─────────────────────────────────────────────── */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ── Status menu ─────────────────────────────────────────────── */
  const [statusMenuOpen, setStatusMenuOpen] = useState(null); // activity id
  const statusMenuRef = useRef(null);

  /* ── Fetch activities ───────────────────────────────────────── */
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const start = toISODate(weekDays[0]);
      const end = toISODate(weekDays[6]);
      const data = await getActivitiesForRange(start, end);
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [weekStart]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  /* ── Fetch goals (for PrepPal link selector) ─────────────────── */
  useEffect(() => {
    getGoals()
      .then(data => setGoals(Array.isArray(data) ? data : []))
      .catch(() => setGoals([]));
  }, []);

  /* ── Close status menu on outside click ─────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
        setStatusMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Week navigation ─────────────────────────────────────────── */
  const goToPrevWeek = () => {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const goToNextWeek = () => {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const goToThisWeek = () => {
    setWeekStart(getWeekStart(new Date()));
    setSelectedDay(new Date());
    setViewMode('week');
  };

  /* ── Open modal ──────────────────────────────────────────────── */
  const openCreateModal = (date = null) => {
    setEditingActivity(null);
    setForm({
      ...defaultForm,
      scheduledDate: date ? toISODate(date) : toISODate(new Date()),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setForm({
      title: activity.title || '',
      description: activity.description || '',
      scheduledDate: activity.scheduledDate || toISODate(new Date()),
      startTime: activity.startTime || '',
      endTime: activity.endTime || '',
      durationMinutes: activity.durationMinutes ? String(activity.durationMinutes) : '',
      activityType: activity.activityType || 'PERSONAL',
      status: activity.status || 'PLANNED',
      category: activity.category || '',
      priority: activity.priority || 'MEDIUM',
      linkedGoalId: activity.linkedGoalId || '',
      linkedGoalTitle: activity.linkedGoalTitle || '',
      linkedTopicId: activity.linkedTopicId || '',
      linkedTopicTitle: activity.linkedTopicTitle || '',
      navigationPath: activity.navigationPath || '',
      recurrence: activity.recurrence || 'NONE',
      recurrenceEndDate: activity.recurrenceEndDate || '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  /* ── Form field helpers ──────────────────────────────────────── */
  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalSelect = (goal) => {
    setForm(prev => ({
      ...prev,
      linkedGoalId: goal.id,
      linkedGoalTitle: goal.title,
      linkedTopicId: '',
      linkedTopicTitle: '',
      navigationPath: '/goals',
    }));
  };

  /* ── Save activity ───────────────────────────────────────────── */
  const handleSave = async () => {
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!form.scheduledDate) {
      setFormError('Scheduled date is required.');
      return;
    }
    setFormError(null);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      scheduledDate: form.scheduledDate,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes, 10) : null,
      activityType: form.activityType,
      status: form.status,
      category: form.category || null,
      priority: form.priority,
      linkedGoalId: form.activityType === 'PREPPAL' ? form.linkedGoalId || null : null,
      linkedGoalTitle: form.activityType === 'PREPPAL' ? form.linkedGoalTitle || null : null,
      linkedTopicId: form.activityType === 'PREPPAL' ? form.linkedTopicId || null : null,
      linkedTopicTitle: form.activityType === 'PREPPAL' ? form.linkedTopicTitle || null : null,
      navigationPath: form.activityType === 'PREPPAL' ? form.navigationPath || null : null,
      recurrence: form.recurrence,
      recurrenceEndDate: form.recurrence !== 'NONE' && form.recurrenceEndDate ? form.recurrenceEndDate : null,
    };

    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id, payload);
      } else {
        await createActivity(payload);
      }
      setModalOpen(false);
      await fetchActivities();
    } catch (err) {
      setFormError(err.message || 'Failed to save activity.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Status update ───────────────────────────────────────────── */
  const handleStatusChange = async (activityId, newStatus) => {
    setStatusMenuOpen(null);
    try {
      await updateActivityStatus(activityId, newStatus);
      setActivities(prev =>
        prev.map(a => a.id === activityId ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  };

  /* ── Delete ──────────────────────────────────────────────────── */
  const handleDelete = async (activityId) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await deleteActivity(activityId);
      setActivities(prev => prev.filter(a => a.id !== activityId));
    } catch (err) {
      setError(err.message || 'Failed to delete activity.');
    }
  };

  /* ── Navigate to PrepPal destination ────────────────────────── */
  const handleActivityClick = (activity) => {
    if (activity.activityType === 'PREPPAL' && activity.navigationPath) {
      navigate(activity.navigationPath);
    }
  };

  /* ── Filter by day ───────────────────────────────────────────── */
  const activitiesForDay = (date) => {
    const dateStr = toISODate(date);
    return activities.filter(a => a.scheduledDate === dateStr);
  };

  /* ── Stats ────────────────────────────────────────────────────── */
  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'COMPLETED').length,
    inProgress: activities.filter(a => a.status === 'IN_PROGRESS').length,
    skipped: activities.filter(a => a.status === 'SKIPPED').length,
  };

  const today = new Date();
  const todayStr = toISODate(today);

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <div className="schedule-page">

      {/* ── Page Header ── */}
      <div className="schedule-page-header">
        <div className="schedule-page-title-row">
          <div className="schedule-page-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <div className="schedule-page-title">Schedule</div>
            <div className="schedule-page-subtitle">Plan your week and stay on track</div>
          </div>
        </div>

        <div className="schedule-toolbar">
          <div className="schedule-view-toggle">
            <button className={`schedule-view-btn ${viewMode === 'week' ? 'active' : ''}`} onClick={() => setViewMode('week')}>Week</button>
            <button className={`schedule-view-btn ${viewMode === 'day' ? 'active' : ''}`} onClick={() => setViewMode('day')}>Day</button>
          </div>
          <button className="schedule-add-btn" onClick={() => openCreateModal()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Activity
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="schedule-error-banner" style={{ marginBottom: '1rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}

      {/* ── Weekly Stats ── */}
      <div className="schedule-stats-row">
        <div className="schedule-stat-card total">
          <div className="schedule-stat-value">{stats.total}</div>
          <div className="schedule-stat-label">This Week</div>
        </div>
        <div className="schedule-stat-card completed">
          <div className="schedule-stat-value">{stats.completed}</div>
          <div className="schedule-stat-label">Completed</div>
        </div>
        <div className="schedule-stat-card progress">
          <div className="schedule-stat-value">{stats.inProgress}</div>
          <div className="schedule-stat-label">In Progress</div>
        </div>
        <div className="schedule-stat-card skipped">
          <div className="schedule-stat-value">{stats.skipped}</div>
          <div className="schedule-stat-label">Skipped</div>
        </div>
      </div>

      {/* ── Week Navigator ── */}
      <div className="schedule-week-nav">
        <div className="week-nav-arrows">
          <button className="week-nav-arrow-btn" onClick={goToPrevWeek} title="Previous week">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="week-nav-arrow-btn" onClick={goToNextWeek} title="Next week">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <span className="week-nav-label">{formatWeekRange(weekStart)}</span>
        <button className="week-nav-today-btn" onClick={goToThisWeek}>Today</button>
      </div>

      {/* ── Week View ── */}
      {viewMode === 'week' && (
        loading ? (
          <div className="schedule-loading">
            <div className="schedule-spinner" />
            Loading schedule…
          </div>
        ) : (
          <div className="schedule-week-grid">
            {weekDays.map((day, i) => {
              const dateStr = toISODate(day);
              const dayActivities = activitiesForDay(day);
              const isToday = dateStr === todayStr;

              return (
                <div className="schedule-day-column" key={dateStr}>
                  <div
                    className={`schedule-day-header ${isToday ? 'today' : ''}`}
                    onClick={() => { setSelectedDay(day); setViewMode('day'); }}
                    title={`View ${day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
                  >
                    <div className="schedule-day-name">{DAY_NAMES[i]}</div>
                    <div className="schedule-day-num">{day.getDate()}</div>
                  </div>

                  <div className="schedule-day-activities">
                    {dayActivities.map(activity => (
                      <div
                        key={activity.id}
                        className={`schedule-activity-card status-${activity.status} type-${activity.activityType}`}
                        onClick={() => activity.activityType === 'PREPPAL' && activity.navigationPath
                          ? handleActivityClick(activity)
                          : openEditModal(activity)
                        }
                        title={activity.title}
                      >
                        <div className="schedule-activity-card-title">{activity.title}</div>
                        {activity.startTime && (
                          <div className="schedule-activity-card-time">{formatTime(activity.startTime)}</div>
                        )}
                        <div className="schedule-activity-card-type">
                          {activity.activityType === 'PREPPAL' ? '⚡ PrepPal' : '● Personal'}
                        </div>
                      </div>
                    ))}

                    <button
                      className="schedule-add-day-btn"
                      onClick={() => openCreateModal(day)}
                      title="Add activity for this day"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── Day View ── */}
      {viewMode === 'day' && (
        <div className="schedule-day-view">
          <div className="schedule-day-view-header">
            <div className="schedule-day-view-nav">
              <button className="week-nav-arrow-btn" onClick={() => {
                const d = new Date(selectedDay);
                d.setDate(d.getDate() - 1);
                setSelectedDay(d);
                setWeekStart(getWeekStart(d));
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div className="schedule-day-view-date">
                {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {toISODate(selectedDay) === todayStr && (
                  <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>TODAY</span>
                )}
              </div>
              <button className="week-nav-arrow-btn" onClick={() => {
                const d = new Date(selectedDay);
                d.setDate(d.getDate() + 1);
                setSelectedDay(d);
                setWeekStart(getWeekStart(d));
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <button className="schedule-add-btn" onClick={() => openCreateModal(selectedDay)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Activity
            </button>
          </div>

          {loading ? (
            <div className="schedule-loading">
              <div className="schedule-spinner" />
              Loading…
            </div>
          ) : (() => {
            const dayActivities = activitiesForDay(selectedDay);
            if (dayActivities.length === 0) {
              return (
                <div className="schedule-empty-state">
                  <div className="schedule-empty-icon">📅</div>
                  <div className="schedule-empty-title">Nothing scheduled for this day</div>
                  <div className="schedule-empty-desc">Add your first activity to get started</div>
                  <button className="schedule-add-btn" onClick={() => openCreateModal(selectedDay)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add First Activity
                  </button>
                </div>
              );
            }

            return (
              <div className="schedule-day-activities-list">
                {dayActivities.map(activity => (
                  <div
                    key={activity.id}
                    className={`schedule-activity-row status-${activity.status}`}
                    style={{ position: 'relative' }}
                  >
                    {/* Time column */}
                    <div className="schedule-activity-row-time">
                      {activity.startTime ? (
                        <>
                          <div className="schedule-activity-row-time-start">{formatTime(activity.startTime)}</div>
                          {activity.endTime && <div className="schedule-activity-row-time-end">{formatTime(activity.endTime)}</div>}
                        </>
                      ) : activity.durationMinutes ? (
                        <div className="schedule-activity-row-time-duration">{activity.durationMinutes}m</div>
                      ) : (
                        <div className="schedule-activity-row-time-duration" style={{ fontSize: '0.7rem', opacity: 0.5 }}>—</div>
                      )}
                    </div>

                    <div className="schedule-activity-row-divider" />

                    {/* Body */}
                    <div className="schedule-activity-row-body">
                      <div className="schedule-activity-row-title">{activity.title}</div>
                      {activity.description && (
                        <div className="schedule-activity-row-desc">{activity.description}</div>
                      )}
                      <div className="schedule-activity-row-badges">
                        <span className={`schedule-badge schedule-badge-type-${activity.activityType?.toLowerCase()}`}>
                          {activity.activityType === 'PREPPAL' ? '⚡ PrepPal' : '● Personal'}
                        </span>
                        <span className={`schedule-badge schedule-badge-status-${activity.status}`}>
                          {STATUS_LABELS[activity.status] || activity.status}
                        </span>
                        {activity.priority && (
                          <span className={`schedule-badge schedule-badge-priority-${activity.priority}`}>
                            {activity.priority}
                          </span>
                        )}
                        {activity.category && (
                          <span className="schedule-badge" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                            {activity.category}
                          </span>
                        )}
                        {activity.linkedGoalTitle && (
                          <span className="schedule-badge" style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--color-primary-500)' }}>
                            🎯 {activity.linkedGoalTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="schedule-activity-row-actions">
                      {/* Status cycle */}
                      <div style={{ position: 'relative' }}>
                        <button
                          className="schedule-action-btn"
                          title="Change status"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusMenuOpen(statusMenuOpen === activity.id ? null : activity.id);
                          }}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[activity.status], display: 'inline-block' }} />
                        </button>
                        {statusMenuOpen === activity.id && (
                          <div className="schedule-status-menu" ref={statusMenuRef}>
                            {STATUS_OPTIONS.map(s => (
                              <button
                                key={s}
                                className="schedule-status-menu-item"
                                onClick={() => handleStatusChange(activity.id, s)}
                              >
                                <span className="schedule-status-dot" style={{ background: STATUS_COLORS[s] }} />
                                {STATUS_LABELS[s]}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Navigate (PrepPal only) */}
                      {activity.activityType === 'PREPPAL' && activity.navigationPath && (
                        <button
                          className="schedule-action-btn"
                          title="Open in PrepPal"
                          onClick={() => navigate(activity.navigationPath)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        className="schedule-action-btn"
                        title="Edit"
                        onClick={() => openEditModal(activity)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/></svg>
                      </button>

                      {/* Delete */}
                      <button
                        className="schedule-action-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADD / EDIT MODAL
          ══════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="schedule-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="schedule-modal">
            <div className="schedule-modal-header">
              <div className="schedule-modal-title">
                {editingActivity ? 'Edit Activity' : 'Add Activity'}
              </div>
              <button className="schedule-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="schedule-modal-body">

              {formError && (
                <div className="schedule-error-banner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {formError}
                </div>
              )}

              {/* Activity Type Toggle */}
              <div className="schedule-form-group">
                <label className="schedule-form-label">Activity Type</label>
                <div className="schedule-type-toggle">
                  <div
                    className={`schedule-type-option ${form.activityType === 'PERSONAL' ? 'active' : ''}`}
                    onClick={() => handleFormChange('activityType', 'PERSONAL')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/></svg>
                    Personal
                  </div>
                  <div
                    className={`schedule-type-option ${form.activityType === 'PREPPAL' ? 'active' : ''}`}
                    onClick={() => handleFormChange('activityType', 'PREPPAL')}
                  >
                    <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><path d="M7 20L11 8l6 9 3-5 3 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    PrepPal Goal
                  </div>
                </div>
              </div>

              {/* PrepPal Goal Selector */}
              {form.activityType === 'PREPPAL' && (
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Link to Goal</label>
                  {goals.length === 0 ? (
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      No goals found. <span style={{ color: 'var(--color-primary-500)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/goals')}>Create a goal first →</span>
                    </p>
                  ) : (
                    <div className="schedule-goal-selector">
                      {goals.map(goal => (
                        <div
                          key={goal.id}
                          className={`schedule-goal-option ${form.linkedGoalId === goal.id ? 'selected' : ''}`}
                          onClick={() => handleGoalSelect(goal)}
                        >
                          <div className="schedule-goal-option-dot" />
                          <div className="schedule-goal-option-title">{goal.title}</div>
                          {goal.category && <div className="schedule-goal-option-cat">{goal.category}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="schedule-form-group">
                <label className="schedule-form-label">Title <span>*</span></label>
                <input
                  type="text"
                  className="schedule-form-input"
                  placeholder="e.g. Solve 5 LeetCode problems"
                  value={form.title}
                  onChange={e => handleFormChange('title', e.target.value)}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="schedule-form-group">
                <label className="schedule-form-label">Description</label>
                <textarea
                  className="schedule-form-textarea"
                  placeholder="Optional notes or context…"
                  value={form.description}
                  onChange={e => handleFormChange('description', e.target.value)}
                />
              </div>

              {/* Date & Status */}
              <div className="schedule-form-row">
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Date <span>*</span></label>
                  <input
                    type="date"
                    className="schedule-form-input"
                    value={form.scheduledDate}
                    onChange={e => handleFormChange('scheduledDate', e.target.value)}
                  />
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Status</label>
                  <select
                    className="schedule-form-select"
                    value={form.status}
                    onChange={e => handleFormChange('status', e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start & End Time */}
              <div className="schedule-form-row">
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Start Time</label>
                  <input
                    type="time"
                    className="schedule-form-input"
                    value={form.startTime}
                    onChange={e => handleFormChange('startTime', e.target.value)}
                  />
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">End Time</label>
                  <input
                    type="time"
                    className="schedule-form-input"
                    value={form.endTime}
                    onChange={e => handleFormChange('endTime', e.target.value)}
                  />
                </div>
              </div>

              {/* Category & Priority */}
              <div className="schedule-form-row">
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Category</label>
                  <select
                    className="schedule-form-select"
                    value={form.category}
                    onChange={e => handleFormChange('category', e.target.value)}
                  >
                    <option value="">— None —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Priority</label>
                  <select
                    className="schedule-form-select"
                    value={form.priority}
                    onChange={e => handleFormChange('priority', e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              {/* Recurrence */}
              <div className="schedule-form-row">
                <div className="schedule-form-group">
                  <label className="schedule-form-label">Repeat</label>
                  <select
                    className="schedule-form-select"
                    value={form.recurrence}
                    onChange={e => handleFormChange('recurrence', e.target.value)}
                  >
                    <option value="NONE">No repeat</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </div>
                {form.recurrence !== 'NONE' && (
                  <div className="schedule-form-group">
                    <label className="schedule-form-label">Repeat Until</label>
                    <input
                      type="date"
                      className="schedule-form-input"
                      value={form.recurrenceEndDate}
                      min={form.scheduledDate}
                      onChange={e => handleFormChange('recurrenceEndDate', e.target.value)}
                    />
                  </div>
                )}
              </div>

            </div>

            <div className="schedule-modal-footer">
              <button className="schedule-btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="schedule-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingActivity ? 'Save Changes' : 'Add Activity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
