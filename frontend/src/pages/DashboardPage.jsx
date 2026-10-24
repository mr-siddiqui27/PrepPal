import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getToken } from '../services/authService';
import { getGoals } from '../services/goalService';
import './DashboardPage.css';

/* ── Helpers ───────────────────────────────────────────────── */

/**
 * Build a map: { "YYYY-MM": { "YYYY-MM-DD": count } }
 * covering the last 12 complete months + current month.
 */
function buildMonthlyData(activityDates) {
  const countMap = {};
  (activityDates || []).forEach(d => {
    const key = d.slice(0, 10);
    countMap[key] = (countMap[key] || 0) + 1;
  });

  const today = new Date();
  // Go back 11 months from current month
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  return months.map(({ year, month }) => {
    const label = new Date(year, month, 1).toLocaleString('default', { month: 'short' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // day-of-week of the 1st (0=Sun)
    const startDow = new Date(year, month, 1).getDay();
    const todayStr = today.toISOString().slice(0, 10);

    // Build cells: leading empties + actual days
    const cells = [];
    for (let e = 0; e < startDow; e++) cells.push(null); // empty placeholder
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dateStr > todayStr) {
        cells.push({ dateStr, count: -1, level: -1 }); // future
      } else {
        const count = countMap[dateStr] || 0;
        const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;
        cells.push({ dateStr, count, level });
      }
    }
    return { label, year, month, cells };
  });
}

function deriveStats(goals) {
  let totalProblems = 0, completedProblems = 0, inProgressProblems = 0, totalTopics = 0;
  const activeGoals = goals.filter(g => g.status !== 'COMPLETED' && g.status !== 'ABANDONED');

  goals.forEach(goal => {
    (goal.topics || []).forEach(topic => {
      totalTopics++;
      (topic.subtopics || []).forEach(chapter => {
        if (chapter.subtopics && chapter.subtopics.length > 0) {
          chapter.subtopics.forEach(problem => {
            totalProblems++;
            if (problem.completed) completedProblems++;
            else inProgressProblems++;
          });
        } else {
          totalProblems++;
          if (chapter.completed) completedProblems++;
          else inProgressProblems++;
        }
      });
    });
  });

  const readiness = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;
  return { totalProblems, completedProblems, inProgressProblems, totalTopics, activeGoals: activeGoals.length, readiness };
}

function computeStreak(activityDates) {
  if (!activityDates || activityDates.length === 0) return { current: 0, max: 0 };
  const unique = [...new Set(activityDates.map(d => d.slice(0, 10)))].sort();
  if (unique.length === 0) return { current: 0, max: 0 };
  let maxStreak = 1, streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = (new Date(unique[i]) - new Date(unique[i - 1])) / 86400000;
    if (diff === 1) { streak++; maxStreak = Math.max(maxStreak, streak); }
    else streak = 1;
  }
  const todayStr = new Date().toISOString().slice(0, 10);
  const daysSince = (new Date(todayStr) - new Date(unique[unique.length - 1])) / 86400000;
  return { current: daysSince <= 1 ? maxStreak : 0, max: maxStreak };
}

/* ── Progress Ring ─────────────────────────────────────────── */
function ProgressRing({ pct, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="db-ring-svg" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--color-primary-500)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.9s ease' }}
      />
    </svg>
  );
}

/* ── Monthly Heatmap Component ─────────────────────────────── */
function MonthlyHeatmap({ monthlyData }) {
  return (
    <div className="db-monthly-heatmap" role="img" aria-label="Monthly activity heatmap for the past year">
      {monthlyData.map((month, mi) => {
        // Split cells into 7-row columns (weeks)
        const cols = [];
        let col = [];
        month.cells.forEach((cell, ci) => {
          col.push(cell);
          if (col.length === 7 || ci === month.cells.length - 1) {
            cols.push([...col]);
            col = [];
          }
        });

        return (
          <div key={mi} className="db-month-block">
            {/* Day cells in columns of 7 */}
            <div className="db-month-grid">
              {cols.map((colCells, ci) => (
                <div key={ci} className="db-month-col">
                  {colCells.map((cell, di) => {
                    if (cell === null) return <div key={di} className="db-cell db-cell--empty" />;
                    if (cell.level === -1) return <div key={di} className="db-cell db-cell--future" />;
                    return (
                      <div
                        key={di}
                        className={`db-cell db-cell--lv${cell.level}`}
                        title={`${cell.dateStr}: ${cell.count} action${cell.count !== 1 ? 's' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            {/* Month label below each block */}
            <div className="db-month-name">{month.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Dashboard Page ────────────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getCurrentUser();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityDates] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pp_activity') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (err) { return []; }
  });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    getGoals()
      .then(data => setGoals(Array.isArray(data) ? data : []))
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const stats = useMemo(() => deriveStats(goals), [goals]);
  const { current: currentStreak, max: maxStreak } = useMemo(() => computeStreak(activityDates), [activityDates]);
  const monthlyData = useMemo(() => buildMonthlyData(activityDates), [activityDates]);

  const heatmapScrollRef = useRef(null);

  // Auto-scroll heatmap to the end (current month) so current month is shown by default
  useEffect(() => {
    if (heatmapScrollRef.current) {
      heatmapScrollRef.current.scrollLeft = heatmapScrollRef.current.scrollWidth;
    }
  }, [monthlyData]);

  const totalActivity = activityDates.length;
  const activeDays = new Set(activityDates.map(d => d.slice(0, 10))).size;

  if (!token) return null;

  return (
    <div className="db-page" id="dashboard-page">

      {/* Welcome */}
      <div className="db-welcome">
        <div>
          <h1 className="db-welcome-title">
            Welcome back, <span className="db-welcome-name">{user?.fullName?.split(' ')[0] || 'Student'}</span>! 👋
          </h1>
          <p className="db-welcome-sub">Here&apos;s your preparation at a glance — keep pushing!</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/goals')} id="db-open-goals-btn">
          Open Goals →
        </button>
      </div>

      {loading ? (
        <div className="db-loading">
          <div className="db-spinner" />
          <span>Loading your progress…</span>
        </div>
      ) : (
        <>
          {/* Middle Row: Progress + Heatmap */}
          <div className="db-mid-row">
            {/* Progress Ring Panel (LeetCode Style: Left Ring, Right 3 Items) */}
            <div className="db-card db-progress-panel">
              <div className="db-card-header">
                <span className="db-card-title">Overall Progress</span>
                <span className="db-badge">{stats.readiness}% Readiness</span>
              </div>
              <div className="db-progress-body">
                <div className="db-ring-wrap">
                  <ProgressRing pct={stats.readiness} />
                  <div className="db-ring-center">
                    <span className="db-ring-pct">{stats.readiness}%</span>
                    <span className="db-ring-sub">Complete</span>
                  </div>
                </div>
                <div className="db-breakdown">
                  <div className="db-breakdown-card db-bc--green">
                    <div className="db-bc-top">
                      <span className="db-bc-label"><span className="db-bc-dot green" /> Completed</span>
                      <span className="db-bc-num">{stats.completedProblems}</span>
                    </div>
                    <div className="db-bc-bar">
                      <div
                        className="db-bc-fill green"
                        style={{ width: `${stats.totalProblems > 0 ? (stats.completedProblems / stats.totalProblems) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="db-breakdown-card db-bc--amber">
                    <div className="db-bc-top">
                      <span className="db-bc-label"><span className="db-bc-dot amber" /> Pending</span>
                      <span className="db-bc-num">{stats.inProgressProblems}</span>
                    </div>
                    <div className="db-bc-bar">
                      <div
                        className="db-bc-fill amber"
                        style={{ width: `${stats.totalProblems > 0 ? (stats.inProgressProblems / stats.totalProblems) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="db-breakdown-card db-bc--blue">
                    <div className="db-bc-top">
                      <span className="db-bc-label"><span className="db-bc-dot blue" /> Topics</span>
                      <span className="db-bc-num">{stats.totalTopics}</span>
                    </div>
                    <div className="db-bc-bar">
                      <div
                        className="db-bc-fill blue"
                        style={{ width: `${stats.totalTopics > 0 ? 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Heatmap — monthly wise */}
            <div className="db-card db-heatmap-panel">
              {/* LeetCode-style borderless header */}
              <div className="db-heatmap-header">
                <div className="db-heatmap-title-row">
                  <span className="db-heatmap-count">
                    <strong>{totalActivity}</strong> preparation action{totalActivity !== 1 ? 's' : ''} in the past year
                  </span>
                  <div className="db-heatmap-stats-bar">
                    <span className="db-stat-item">Total active days: <strong>{activeDays}</strong></span>
                    <span className="db-stat-sep" aria-hidden="true">•</span>
                    <span className="db-stat-item">Max streak: <strong>{maxStreak}</strong></span>
                    <span className="db-stat-sep" aria-hidden="true">•</span>
                    <span className="db-stat-item">Current streak: <strong>{currentStreak} 🔥</strong></span>
                  </div>
                </div>
              </div>

              {/* Monthly grid */}
              <div className="db-heatmap-scroll" ref={heatmapScrollRef}>
                <MonthlyHeatmap monthlyData={monthlyData} />

                {/* Legend */}
                <div className="db-heatmap-legend">
                  <span className="db-legend-lbl">Less</span>
                  {[0, 1, 2, 3, 4].map(lv => (
                    <div key={lv} className={`db-cell db-cell--lv${lv}`} aria-hidden="true" />
                  ))}
                  <span className="db-legend-lbl">More</span>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Summary */}
          <div className="db-card db-goals-panel">
            <div className="db-card-header">
              <span className="db-card-title">Preparation Goals</span>
              <button className="db-card-link" onClick={() => navigate('/goals')}>View all →</button>
            </div>

            {goals.length === 0 ? (
              <div className="db-empty">
                <span className="db-empty-icon">🎯</span>
                <p>No goals yet. Create your first preparation goal to get started!</p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/goals')}>Create a Goal</button>
              </div>
            ) : (
              <div className="db-goals-list">
                {goals.slice(0, 6).map(goal => {
                  let total = 0, done = 0;
                  (goal.topics || []).forEach(t => {
                    (t.subtopics || []).forEach(ch => {
                      if (ch.subtopics && ch.subtopics.length > 0) {
                        ch.subtopics.forEach(p => { total++; if (p.completed) done++; });
                      } else { total++; if (ch.completed) done++; }
                    });
                  });
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  const statusClass =
                    goal.status === 'COMPLETED' ? 'db-gs--done'
                    : goal.status === 'IN_PROGRESS' ? 'db-gs--active'
                    : goal.status === 'ABANDONED' ? 'db-gs--abandoned'
                    : 'db-gs--todo';
                  const statusLabel =
                    goal.status === 'COMPLETED' ? 'Completed'
                    : goal.status === 'IN_PROGRESS' ? 'In Progress'
                    : goal.status === 'ABANDONED' ? 'Abandoned'
                    : 'Not Started';

                  return (
                    <div
                      key={goal.id}
                      className="db-goal-row"
                      onClick={() => navigate('/goals')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && navigate('/goals')}
                    >
                      <div className="db-goal-info">
                        <span className="db-goal-name">{goal.title}</span>
                        <span className={`db-goal-status ${statusClass}`}>{statusLabel}</span>
                      </div>
                      <div className="db-goal-progress-row">
                        <div className="db-goal-bar-track">
                          <div className="db-goal-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="db-goal-pct">{pct}%</span>
                      </div>
                      <span className="db-goal-count">{done}/{total} tasks</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="db-quick-row">
            {[
              { icon: '🎯', label: 'Preparation Goals', onClick: () => navigate('/goals'), id: 'db-q-goals' },
              { icon: '👤', label: 'Student Profile', onClick: () => navigate('/profile'), id: 'db-q-profile' },
              { icon: '🤖', label: 'AI Mock Interview', soon: true, id: 'db-q-mock' },
              { icon: '📊', label: 'Readiness Score', soon: true, id: 'db-q-readiness' },
            ].map(item => (
              <button
                key={item.id}
                id={item.id}
                className={`db-quick-card${item.soon ? ' db-quick-card--soon' : ''}`}
                onClick={item.onClick}
                disabled={item.soon}
              >
                <span className="db-quick-icon">{item.icon}</span>
                <span className="db-quick-label">
                  {item.label}
                  {item.soon && <span className="db-soon">Soon</span>}
                </span>
                <span className="db-quick-arrow">→</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

