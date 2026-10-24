import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import * as goalService from '../services/goalService';
import './GoalsPage.css';

export default function GoalsPage() {
  const navigate = useNavigate();
  const token = getToken();

  // Goals State
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBookmarkOnly, setFilterBookmarkOnly] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, INCOMPLETE, COMPLETED

  // Bookmarks State (persisted to localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('preppal_bookmarks') || '[]'));
    } catch {
      return new Set();
    }
  });

  // Expanded topic IDs (Set of strings)
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  // Expanded subtopic IDs (Set of strings)
  const [expandedSubtopics, setExpandedSubtopics] = useState(new Set());

  // Active 3-dots context menu: { id } | null
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Inline rapid inputs state
  const [topicInputInline, setTopicInputInline] = useState('');
  const [subtopicInputs, setSubtopicInputs] = useState({}); // { [topicId]: string }
  const [problemInputs, setProblemInputs] = useState({});   // { [subtopicId]: string }

  // ── Modals State ──────────────────────────────────────────────
  // 1. Goal Create/Edit Modal
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'DSA & Algorithms',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    targetDate: ''
  });

  // 2. Topic Modal
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [activeGoalForTopic, setActiveGoalForTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({ title: '', description: '' });

  // 3. Subtopic Modal (Middle level)
  const [subtopicModalOpen, setSubtopicModalOpen] = useState(false);
  const [editingSubtopicData, setEditingSubtopicData] = useState(null); // { goalId, topicId, subtopic }
  const [subtopicForm, setSubtopicForm] = useState({ title: '', description: '' });

  // 4. Sub-subtopic (Leaf Problem/Task) Modal
  const [problemModalOpen, setProblemModalOpen] = useState(false);
  const [editingProblemData, setEditingProblemData] = useState(null); // { goalId, topicId, subtopicId, problem }
  const [problemForm, setProblemForm] = useState({ title: '', estimatedMinutes: '', difficulty: 'Medium' });

  // 5. Notes Modal (Goal, Topic, Subtopic, Problem)
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [activeNotesTarget, setActiveNotesTarget] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);

  // 6. Resources Modal (Goal, Topic, Subtopic, Problem)
  const [resourcesModalOpen, setResourcesModalOpen] = useState(false);
  const [activeResourcesTarget, setActiveResourcesTarget] = useState(null);
  const [newResourceForm, setNewResourceForm] = useState({ title: '', url: '', type: 'Article', description: '' });
  const [resourceSaving, setResourceSaving] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Load goals from backend
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    goalService.getGoals()
      .then(data => {
        if (!isMounted) return;
        setGoals(data);
        if (data.length > 0) {
          setSelectedGoalId(prev => {
            if (prev && data.some(g => g.id === prev)) return prev;
            return data[0].id;
          });
          // All goals/topics are collapsed by default
          setExpandedTopics(new Set());
          setExpandedSubtopics(new Set());
        } else {
          setSelectedGoalId(null);
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load preparation goals.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token, refreshTrigger]);

  // Close active 3-dots popup menu on click outside
  useEffect(() => {
    const handleGlobalClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const reloadData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Currently selected goal
  const currentGoal = goals.find(g => g.id === selectedGoalId) || goals[0] || null;

  // ── Bookmarks Handler ─────────────────────────────────────────
  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('preppal_bookmarks', JSON.stringify([...next]));
      } catch (err) {
        console.error('Failed to save bookmark', err);
      }
      return next;
    });
  };

  // ── Toggle Topic & Subtopic Accordions ────────────────────────
  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const toggleSubtopic = (subtopicId, e) => {
    if (e) e.stopPropagation();
    setExpandedSubtopics(prev => {
      const next = new Set(prev);
      if (next.has(subtopicId)) next.delete(subtopicId);
      else next.add(subtopicId);
      return next;
    });
  };

  const expandAll = () => {
    if (!currentGoal || !currentGoal.topics) return;
    setExpandedTopics(new Set(currentGoal.topics.map(t => t.id)));
    setExpandedSubtopics(new Set(currentGoal.topics.flatMap(t => (t.subtopics || []).map(s => s.id))));
  };

  const collapseAll = () => {
    setExpandedTopics(new Set());
    setExpandedSubtopics(new Set());
  };

  // ── Goal Status Handler ───────────────────────────────────────
  const handleStatusChange = async (newStatus) => {
    if (!currentGoal) return;
    const oldStatus = currentGoal.status;
    setGoals(prev => prev.map(g => g.id === currentGoal.id ? { ...g, status: newStatus } : g));

    try {
      const updated = await goalService.updateGoalStatus(currentGoal.id, newStatus);
      setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
      showToast(`Goal status updated to ${newStatus}.`);
    } catch (err) {
      setGoals(prev => prev.map(g => g.id === currentGoal.id ? { ...g, status: oldStatus } : g));
      setError(`Failed to update status: ${err.message}`);
    }
  };

  // ── Goal CRUD ─────────────────────────────────────────────────
  const openCreateGoalModal = () => {
    setEditingGoal(null);
    setGoalForm({
      title: '',
      description: '',
      category: 'DSA & Algorithms',
      priority: 'MEDIUM',
      status: 'ACTIVE',
      targetDate: ''
    });
    setGoalModalOpen(true);
  };

  const openEditGoalModal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title || '',
      description: goal.description || '',
      category: goal.category || 'DSA & Algorithms',
      priority: goal.priority || 'MEDIUM',
      status: goal.status || 'ACTIVE',
      targetDate: goal.targetDate || ''
    });
    setGoalModalOpen(true);
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;

    try {
      if (editingGoal) {
        const updated = await goalService.updateGoal(editingGoal.id, goalForm);
        setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
        showToast('Goal updated successfully!');
      } else {
        const created = await goalService.createGoal(goalForm);
        setGoals(prev => [created, ...prev]);
        setSelectedGoalId(created.id);
        setExpandedTopics(new Set());
        setExpandedSubtopics(new Set());
        showToast('New goal created!');
      }
      setGoalModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to save goal.');
    }
  };

  const handleDeleteGoal = async (goalId, title) => {
    if (!window.confirm(`Are you sure you want to delete goal: "${title}"? All nested topics, subtopics and tasks will be removed.`)) return;

    try {
      await goalService.deleteGoal(goalId);
      setGoals(prev => {
        const remaining = prev.filter(g => g.id !== goalId);
        if (selectedGoalId === goalId) {
          setSelectedGoalId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
      });
      showToast('Goal deleted.');
    } catch (err) {
      setError(err.message || 'Failed to delete goal.');
    }
  };

  // ── Topic CRUD (Level 1) ──────────────────────────────────────
  const openAddTopicModal = (goalId) => {
    setActiveGoalForTopic(goalId);
    setEditingTopic(null);
    setTopicForm({ title: '', description: '' });
    setTopicModalOpen(true);
  };

  const openEditTopicModal = (goalId, topic) => {
    setActiveGoalForTopic(goalId);
    setEditingTopic(topic);
    setTopicForm({ title: topic.title || '', description: topic.description || '' });
    setTopicModalOpen(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.title.trim() || !activeGoalForTopic) return;

    try {
      let updatedGoal;
      if (editingTopic) {
        updatedGoal = await goalService.updateTopic(activeGoalForTopic, editingTopic.id, topicForm);
        showToast('Topic updated.');
      } else {
        updatedGoal = await goalService.addTopic(activeGoalForTopic, topicForm);
        if (updatedGoal.topics && updatedGoal.topics.length > 0) {
          const newTopic = updatedGoal.topics[updatedGoal.topics.length - 1];
          setExpandedTopics(prev => new Set(prev).add(newTopic.id));
        }
        showToast('Topic added.');
      }
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setTopicModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to save topic.');
    }
  };

  const handleDeleteTopic = async (goalId, topicId, topicTitle) => {
    if (!window.confirm(`Delete topic "${topicTitle}"? Its subtopics and tasks will also be deleted.`)) return;

    try {
      const updatedGoal = await goalService.deleteTopic(goalId, topicId);
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      showToast('Topic deleted.');
    } catch (err) {
      setError(err.message || 'Failed to delete topic.');
    }
  };

  // ── Inline Topic Addition ─────────────────────────────────────
  const handleAddTopicInline = async () => {
    const title = topicInputInline.trim();
    if (!title || !currentGoal) return;

    try {
      const updatedGoal = await goalService.addTopic(currentGoal.id, { title });
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      if (updatedGoal.topics && updatedGoal.topics.length > 0) {
        const newTopic = updatedGoal.topics[updatedGoal.topics.length - 1];
        setExpandedTopics(prev => new Set(prev).add(newTopic.id));
      }
      setTopicInputInline('');
      showToast('Topic added.');
    } catch (err) {
      setError(err.message || 'Failed to add topic.');
    }
  };

  // ── Subtopic CRUD (Level 2: Sub-module / Chapter) ─────────────
  const handleAddSubtopicInline = async (goalId, topicId) => {
    const title = (subtopicInputs[topicId] || '').trim();
    if (!title) return;

    try {
      const updatedGoal = await goalService.addSubtopic(goalId, topicId, { title });
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setSubtopicInputs(prev => ({ ...prev, [topicId]: '' }));
      // Auto-expand the newly created chapter so problem input is immediately visible
      const updatedTopic = (updatedGoal.topics || []).find(t => t.id === topicId);
      if (updatedTopic && updatedTopic.subtopics && updatedTopic.subtopics.length > 0) {
        const lastSub = updatedTopic.subtopics[updatedTopic.subtopics.length - 1];
        setExpandedSubtopics(prev => new Set(prev).add(lastSub.id));
      }
      showToast('Subtopic chapter added.');
    } catch (err) {
      setError(err.message || 'Failed to add subtopic.');
    }
  };

  const openEditSubtopicModal = (goalId, topicId, subtopic) => {
    setEditingSubtopicData({ goalId, topicId, subtopic });
    setSubtopicForm({ title: subtopic.title || '', description: subtopic.description || '' });
    setSubtopicModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveSubtopic = async (e) => {
    e.preventDefault();
    if (!editingSubtopicData || !subtopicForm.title.trim()) return;

    const { goalId, topicId, subtopic } = editingSubtopicData;
    try {
      const updatedGoal = await goalService.updateSubtopic(goalId, topicId, subtopic.id, {
        title: subtopicForm.title.trim(),
        description: subtopicForm.description
      });
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setSubtopicModalOpen(false);
      showToast('Subtopic chapter updated.');
    } catch (err) {
      setError(err.message || 'Failed to update subtopic.');
    }
  };

  const handleDeleteSubtopic = async (goalId, topicId, subtopicId) => {
    if (!window.confirm('Delete this chapter and all its tasks?')) return;
    try {
      const updatedGoal = await goalService.deleteSubtopic(goalId, topicId, subtopicId);
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setActiveMenuId(null);
      showToast('Subtopic removed.');
    } catch (err) {
      setError(err.message || 'Failed to delete subtopic.');
    }
  };

  // ── Sub-subtopic (Level 3: Leaf Problem / Task) ────────────────
  const handleAddProblemInline = async (goalId, topicId, subtopicId) => {
    const title = (problemInputs[subtopicId] || '').trim();
    if (!title) return;

    try {
      const updatedGoal = await goalService.addSubSubtopic(goalId, topicId, subtopicId, { title });
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setProblemInputs(prev => ({ ...prev, [subtopicId]: '' }));
      setExpandedSubtopics(prev => new Set(prev).add(subtopicId));
      showToast('Problem added to checklist.');
    } catch (err) {
      setError(err.message || 'Failed to add problem.');
    }
  };

  const handleToggleProblem = async (goalId, topicId, problemId, currentStatus) => {
    const targetStatus = !currentStatus;

    // Optimistic UI update
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        topics: (g.topics || []).map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subtopics: (t.subtopics || []).map(sub => {
              if (sub.id === problemId) {
                return { ...sub, completed: targetStatus };
              }
              if (sub.subtopics && sub.subtopics.length > 0) {
                return {
                  ...sub,
                  subtopics: sub.subtopics.map(item => item.id === problemId ? { ...item, completed: targetStatus } : item)
                };
              }
              return sub;
            })
          };
        })
      };
    }));

    try {
      const updated = await goalService.toggleSubtopic(goalId, topicId, problemId, targetStatus);
      setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
      // Track activity for dashboard heatmap
      if (targetStatus) {
        try {
          const log = JSON.parse(localStorage.getItem('pp_activity') || '[]');
          log.push(new Date().toISOString());
          localStorage.setItem('pp_activity', JSON.stringify(log));
        } catch (_) { /* non-critical */ }
      }
    } catch (err) {
      setError(`Failed to toggle: ${err.message}`);
      reloadData();
    }
  };

  const openEditProblemModal = (goalId, topicId, problem) => {
    setEditingProblemData({ goalId, topicId, problem });
    setProblemForm({
      title: problem.title || '',
      estimatedMinutes: problem.estimatedMinutes ? String(problem.estimatedMinutes) : '',
      difficulty: problem.difficulty || 'Medium'
    });
    setProblemModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    if (!editingProblemData || !problemForm.title.trim()) return;

    const { goalId, topicId, problem } = editingProblemData;
    const payload = {
      title: problemForm.title.trim(),
      estimatedMinutes: problemForm.estimatedMinutes ? parseInt(problemForm.estimatedMinutes, 10) : null,
      difficulty: problemForm.difficulty,
      completed: problem.completed
    };

    try {
      const updatedGoal = await goalService.updateSubtopic(goalId, topicId, problem.id, payload);
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setProblemModalOpen(false);
      showToast('Problem updated.');
    } catch (err) {
      setError(err.message || 'Failed to update problem.');
    }
  };

  const handleDeleteProblem = async (goalId, topicId, problemId) => {
    try {
      const updatedGoal = await goalService.deleteSubtopic(goalId, topicId, problemId);
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setActiveMenuId(null);
      showToast('Problem removed.');
    } catch (err) {
      setError(err.message || 'Failed to delete problem.');
    }
  };

  // ── Notes Modal Handlers (At All Levels) ──────────────────────
  const openNotesModal = (level, goalId, topicId = null, subtopicId = null, title = '', initialNotes = '') => {
    setActiveNotesTarget({ level, goalId, topicId, subtopicId, title });
    setNotesText(initialNotes || '');
    setNotesModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveNotes = async () => {
    if (!activeNotesTarget) return;
    const { level, goalId, topicId, subtopicId } = activeNotesTarget;

    try {
      setNotesSaving(true);
      let updatedGoal;
      if (level === 'goal') {
        updatedGoal = await goalService.updateGoalNotes(goalId, notesText);
      } else if (level === 'topic') {
        updatedGoal = await goalService.updateTopicNotes(goalId, topicId, notesText);
      } else {
        // subtopic or problem
        updatedGoal = await goalService.updateSubtopicNotes(goalId, topicId, subtopicId, notesText);
      }

      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setNotesModalOpen(false);
      showToast('Notes saved successfully!');
    } catch (err) {
      setError(`Failed to save notes: ${err.message}`);
    } finally {
      setNotesSaving(false);
    }
  };

  const handleClearNotes = () => {
    if (!window.confirm('Clear notes?')) return;
    setNotesText('');
  };

  // ── Resources Modal Handlers (At All Levels) ──────────────────
  const openResourcesModal = (level, goalId, topicId = null, subtopicId = null, title = '', resources = [], presetType = 'Article') => {
    setActiveResourcesTarget({ level, goalId, topicId, subtopicId, title, resources });
    setNewResourceForm({ title: '', url: '', type: presetType, description: '' });
    setResourcesModalOpen(true);
    setActiveMenuId(null);
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!activeResourcesTarget || !newResourceForm.title.trim() || !newResourceForm.url.trim()) return;

    const { level, goalId, topicId, subtopicId } = activeResourcesTarget;

    if (!/^https?:\/\//i.test(newResourceForm.url.trim())) {
      setError('Resource URL must start with http:// or https://');
      return;
    }

    try {
      setResourceSaving(true);
      let updatedGoal;
      if (level === 'goal') {
        updatedGoal = await goalService.addGoalResource(goalId, newResourceForm);
      } else if (level === 'topic') {
        updatedGoal = await goalService.addTopicResource(goalId, topicId, newResourceForm);
      } else {
        updatedGoal = await goalService.addSubtopicResource(goalId, topicId, subtopicId, newResourceForm);
      }

      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setResourcesModalOpen(false);
      showToast('Resource attached!');
    } catch (err) {
      setError(`Failed to add resource: ${err.message}`);
    } finally {
      setResourceSaving(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!activeResourcesTarget) return;
    const { level, goalId, topicId, subtopicId } = activeResourcesTarget;

    try {
      let updatedGoal;
      if (level === 'goal') {
        updatedGoal = await goalService.deleteGoalResource(goalId, resourceId);
      } else if (level === 'topic') {
        updatedGoal = await goalService.deleteTopicResource(goalId, topicId, resourceId);
      } else {
        updatedGoal = await goalService.deleteSubtopicResource(goalId, topicId, subtopicId, resourceId);
      }

      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setActiveResourcesTarget(prev => ({
        ...prev,
        resources: (prev.resources || []).filter(r => r.id !== resourceId)
      }));
      showToast('Resource removed.');
    } catch (err) {
      setError(`Failed to remove resource: ${err.message}`);
    }
  };

  // ── Share Goal Link ───────────────────────────────────────────
  const handleShareGoal = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Sheet link copied to clipboard!');
    } else {
      showToast('Share: ' + window.location.href);
    }
  };

  // ── Derived Stats & Aggregations Across All 3 Levels ──────────
  const allLeafProblems = useMemo(() => {
    if (!currentGoal || !currentGoal.topics) return [];
    const leaves = [];
    currentGoal.topics.forEach(t => {
      (t.subtopics || []).forEach(sub => {
        if (sub.subtopics && sub.subtopics.length > 0) {
          sub.subtopics.forEach(p => {
            leaves.push({ ...p, parentTopicId: t.id, parentSubtopicId: sub.id });
          });
        } else {
          // If no nested sub-subtopics, treat the subtopic as leaf problem
          leaves.push({ ...sub, parentTopicId: t.id, parentSubtopicId: null });
        }
      });
    });
    return leaves;
  }, [currentGoal]);

  const totalProblems = allLeafProblems.length;
  const completedProblems = allLeafProblems.filter(p => p.completed).length;
  const goalProgress = totalProblems > 0
    ? Math.round((completedProblems / totalProblems) * 100)
    : 0;

  // Breakdown (Basic, Core, Pro)
  const breakdownStats = useMemo(() => {
    let basicTotal = 0;
    let basicDone = 0;
    let coreTotal = 0;
    let coreDone = 0;
    let proTotal = 0;
    let proDone = 0;

    allLeafProblems.forEach(p => {
      const diff = (p.difficulty || '').toLowerCase();
      if (diff === 'easy') {
        basicTotal++;
        if (p.completed) basicDone++;
      } else if (diff === 'hard') {
        proTotal++;
        if (p.completed) proDone++;
      } else {
        coreTotal++;
        if (p.completed) coreDone++;
      }
    });

    if (basicTotal === 0 && proTotal === 0 && coreTotal > 0) {
      const p1 = Math.ceil(coreTotal * 0.3);
      const p3 = Math.floor(coreTotal * 0.25);
      const p2 = coreTotal - p1 - p3;
      basicTotal = p1;
      coreTotal = p2;
      proTotal = p3;
      basicDone = Math.min(basicTotal, completedProblems);
      coreDone = Math.min(coreTotal, Math.max(0, completedProblems - basicDone));
      proDone = Math.min(proTotal, Math.max(0, completedProblems - basicDone - coreDone));
    }

    return { basicTotal, basicDone, coreTotal, coreDone, proTotal, proDone };
  }, [allLeafProblems, completedProblems]);

  // Next problem for "Up next" pill
  const upNextProblem = useMemo(() => {
    return allLeafProblems.find(p => !p.completed) || null;
  }, [allLeafProblems]);

  const scrollToProblem = (problemId, topicId, subtopicId) => {
    if (!problemId) return;
    if (topicId) setExpandedTopics(prev => new Set(prev).add(topicId));
    if (subtopicId) setExpandedSubtopics(prev => new Set(prev).add(subtopicId));

    setTimeout(() => {
      const el = document.getElementById(`problem-row-${problemId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('problem-row--highlight');
        setTimeout(() => el.classList.remove('problem-row--highlight'), 2000);
      }
    }, 150);
  };

  const handlePickRandom = () => {
    const uncompleted = allLeafProblems.filter(p => !p.completed);
    if (uncompleted.length === 0) {
      showToast('All tasks are completed! Awesome work.');
      return;
    }
    const randomIndex = Math.floor(Math.random() * uncompleted.length);
    const chosen = uncompleted[randomIndex];
    scrollToProblem(chosen.id, chosen.parentTopicId, chosen.parentSubtopicId);
    showToast(`Picked: "${chosen.title}"`);
  };

  // Filter topics, subtopics, and problems based on search, bookmark, status
  const filteredTopics = useMemo(() => {
    if (!currentGoal || !currentGoal.topics) return [];

    const query = searchQuery.trim().toLowerCase();

    return currentGoal.topics.map(topic => {
      const subtopics = (topic.subtopics || []).map(sub => {
        let problems = sub.subtopics && sub.subtopics.length > 0 ? sub.subtopics : [sub];

        if (query) {
          problems = problems.filter(p =>
            p.title.toLowerCase().includes(query) ||
            sub.title.toLowerCase().includes(query) ||
            topic.title.toLowerCase().includes(query)
          );
        }

        if (filterBookmarkOnly) {
          problems = problems.filter(p => bookmarkedIds.has(p.id));
        }

        if (filterStatus === 'COMPLETED') {
          problems = problems.filter(p => p.completed);
        } else if (filterStatus === 'INCOMPLETE') {
          problems = problems.filter(p => !p.completed);
        }

        return {
          ...sub,
          displayedProblems: problems
        };
      }).filter(sub => {
        if (!query && !filterBookmarkOnly && filterStatus === 'ALL') return true;
        return sub.displayedProblems.length > 0;
      });

      return {
        ...topic,
        displayedSubtopics: subtopics
      };
    }).filter(topic => {
      if (!query && !filterBookmarkOnly && filterStatus === 'ALL') return true;
      return topic.displayedSubtopics.length > 0;
    });
  }, [currentGoal, searchQuery, filterBookmarkOnly, filterStatus, bookmarkedIds]);

  return (
    <div className="goals-page" id="goals-page-root">
      <div className="goals-container">

        {/* ── Breadcrumb & Top Bar ──────────────────────────────── */}
        <div className="goals-top-bar">
          <nav className="goals-breadcrumb" aria-label="Breadcrumb">
            <span className="goals-breadcrumb-root">PrepPal</span>
            <span className="goals-breadcrumb-sep">/</span>
            <span className="goals-breadcrumb-current">
              {currentGoal ? currentGoal.title : 'Preparation Goals'}
            </span>
          </nav>

          <div className="goals-top-actions">
            <button
              onClick={openCreateGoalModal}
              className="btn-theme-primary"
              id="top-create-goal-btn"
            >
              + Create Goal
            </button>
          </div>
        </div>

        {/* ── Goals Switcher (TakeUForward Sheet Tabs) ─────────── */}
        {goals.length > 0 && (
          <div className="goals-switcher-bar" role="tablist">
            {goals.map(g => {
              const isActive = g.id === selectedGoalId;
              const p = g.progress >= 0 ? g.progress : 0;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGoalId(g.id);
                    setExpandedTopics(new Set());
                    setExpandedSubtopics(new Set());
                  }}
                  className={`goal-tab-pill ${isActive ? 'goal-tab-pill--active' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span>{g.title}</span>
                  <span className="goal-tab-badge">{p}%</span>
                </button>
              );
            })}
            <button onClick={openCreateGoalModal} className="goal-tab-create-btn">
              + New Sheet
            </button>
          </div>
        )}

        {/* ── Alerts Banner ───────────────────────────────────── */}
        {error && (
          <div className="theme-alert theme-alert--error" role="alert">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="icon-action-btn" style={{ color: 'var(--color-error)' }}>✕</button>
          </div>
        )}
        {toastMsg && (
          <div className="theme-alert theme-alert--success" role="status">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ── Empty State ─────────────────────────────────────── */}
        {!loading && goals.length === 0 && (
          <div className="sheet-content-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>No preparation sheets created yet</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Create your preparation sheet to organize topics into chapters, track subtopics and problems, attach learning resources, and monitor placement readiness.
            </p>
            <button onClick={openCreateGoalModal} className="btn-theme-primary">
              + Create Your First Sheet
            </button>
          </div>
        )}

        {/* ── Active Goal Hero Card (Exact TakeUForward Replica) ─ */}
        {currentGoal && (
          <>
            <div className="sheet-header-card" id={`goal-sheet-${currentGoal.id}`}>
              {/* Left Column: Title, Description, Meta, Action Pills */}
              <div className="sheet-header__left">
                <div className="sheet-title-row">
                  <h1 className="sheet-title">{currentGoal.title}</h1>
                </div>

                {currentGoal.description && (
                  <p className="sheet-description">{currentGoal.description}</p>
                )}

                {/* PrepPal Meta Tags */}
                <div className="sheet-meta-badges">
                  <span className="striver-online-badge">
                    <span className="online-dot" /> Active Goal
                  </span>
                  {currentGoal.targetDate && (
                    <span className="striver-meta-text">Target: {currentGoal.targetDate}</span>
                  )}

                  {currentGoal.category && (
                    <span className="sheet-badge sheet-badge--category">{currentGoal.category}</span>
                  )}

                  <span className={`sheet-badge ${
                    currentGoal.priority === 'HIGH' ? 'sheet-badge--priority-high' :
                    currentGoal.priority === 'LOW' ? 'sheet-badge--priority-low' : 'sheet-badge--priority-med'
                  }`}>
                    {currentGoal.priority || 'MEDIUM'} Priority
                  </span>

                  {/* Status Dropdown */}
                  <div className="status-select-wrap">
                    <span className={`status-indicator-dot ${
                      currentGoal.status === 'COMPLETED' ? 'status-dot--completed' :
                      currentGoal.status === 'PAUSED' ? 'status-dot--paused' : 'status-dot--active'
                    }`} />
                    <select
                      className="status-select"
                      value={currentGoal.status || 'ACTIVE'}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      title="Change Goal Status"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Quick Action Pills */}
                <div className="sheet-actions-row">
                  {upNextProblem ? (
                    <button
                      onClick={() => scrollToProblem(upNextProblem.id, upNextProblem.parentTopicId, upNextProblem.parentSubtopicId)}
                      className="btn-up-next"
                      title="Jump to the next uncompleted problem"
                    >
                      <span>Up next : <strong>{upNextProblem.title}</strong></span>
                      <span className="up-next-arrow">↓</span>
                    </button>
                  ) : (
                    <div className="btn-up-next btn-up-next--done">
                      <span>🎉 All problems completed!</span>
                    </div>
                  )}

                  <button
                    onClick={() => openAddTopicModal(currentGoal.id)}
                    className="btn-theme-action"
                    id="add-topic-main-btn"
                  >
                    + Add Topic
                  </button>

                  <button
                    onClick={() => openNotesModal('goal', currentGoal.id, null, null, currentGoal.title, currentGoal.notes)}
                    className={`btn-theme-action ${currentGoal.notes ? 'btn-theme-action--active' : ''}`}
                    title="Goal Notes"
                  >
                    📝 Notes {currentGoal.notes ? '•' : ''}
                  </button>

                  <button
                    onClick={() => openResourcesModal('goal', currentGoal.id, null, null, currentGoal.title, currentGoal.resources)}
                    className="btn-theme-action"
                    title="Goal Resources"
                  >
                    🔗 Resources ({currentGoal.resources?.length || 0})
                  </button>

                  <button
                    onClick={() => openEditGoalModal(currentGoal)}
                    className="btn-theme-action"
                    title="Edit Sheet"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDeleteGoal(currentGoal.id, currentGoal.title)}
                    className="btn-theme-danger"
                    title="Delete Goal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Right Column: Overall Progress Card */}
              <div className="overall-progress-card">
                <div className="progress-card-top">
                  <span className="progress-card-title">Overall Progress</span>
                  <button
                    onClick={handleShareGoal}
                    className="progress-share-btn"
                    title="Share Sheet Link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    <span>Share</span>
                  </button>
                </div>

                <div className="progress-card-middle">
                  <div className="progress-big-number-row">
                    <span className="progress-big-number">{goalProgress} %</span>
                    <span className="progress-subtext">
                      {totalProblems > 0
                        ? `${completedProblems} / ${totalProblems} problems solved`
                        : 'No problems added yet'}
                    </span>
                  </div>

                  {/* Smooth Progress Slider Bar with Medal/Thumb */}
                  <div className="progress-slider-wrap">
                    <div
                      className="progress-slider-fill"
                      style={{ width: `${Math.min(100, Math.max(0, goalProgress))}%` }}
                    >
                      {goalProgress > 0 && <span className="progress-slider-thumb" />}
                    </div>
                  </div>
                </div>

                {/* 3-Column Breakdown (Basic, Core, Pro) */}
                <div className="progress-breakdown-row">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Basic</span>
                    <span className="breakdown-value">{breakdownStats.basicDone} / {breakdownStats.basicTotal}</span>
                    <div className="breakdown-bar breakdown-bar--green" />
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Core</span>
                    <span className="breakdown-value">{breakdownStats.coreDone} / {breakdownStats.coreTotal}</span>
                    <div className="breakdown-bar breakdown-bar--yellow" />
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Pro</span>
                    <span className="breakdown-value">{breakdownStats.proDone} / {breakdownStats.proTotal}</span>
                    <div className="breakdown-bar breakdown-bar--coral" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Toolbar Under Hero Header ───────────────────────── */}
            <div className="sheet-toolbar-panel">
              <div className="sheet-search-wrap">
                <svg className="sheet-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search problems or chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sheet-search-input"
                  id="sheet-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="sheet-search-clear">✕</button>
                )}
              </div>

              <div className="sheet-toolbar-tools">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="sheet-toolbar-select"
                >
                  <option value="ALL">All Problems</option>
                  <option value="INCOMPLETE">Incomplete</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <button
                  onClick={() => setFilterBookmarkOnly(prev => !prev)}
                  className={`sheet-tool-btn ${filterBookmarkOnly ? 'sheet-tool-btn--active' : ''}`}
                  title="Filter bookmarked problems"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={filterBookmarkOnly ? '#f59e0b' : 'none'} stroke={filterBookmarkOnly ? '#f59e0b' : 'currentColor'} strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>

                <button
                  onClick={handlePickRandom}
                  className="sheet-tool-btn"
                  title="Pick a random problem to solve"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 3 21 3 21 8"/>
                    <line x1="4" y1="20" x2="21" y2="3"/>
                    <polyline points="21 16 21 21 16 21"/>
                    <line x1="15" y1="15" x2="21" y2="21"/>
                    <line x1="4" y1="4" x2="9" y2="9"/>
                  </svg>
                </button>

                <button
                  onClick={expandedTopics.size > 0 ? collapseAll : expandAll}
                  className="sheet-tool-btn"
                >
                  {expandedTopics.size > 0 ? 'Collapse All' : 'Expand All'}
                </button>

                <button
                  onClick={() => openAddTopicModal(currentGoal.id)}
                  className="btn-theme-primary btn-sm"
                >
                  + Add Topic
                </button>
              </div>
            </div>

            {/* ── Topics & 3-Level Hierarchy (Topic -> Subtopic -> Problem) ─ */}
            <div className="sheet-content-panel">
              {filteredTopics.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  {searchQuery || filterBookmarkOnly || filterStatus !== 'ALL' ? (
                    <p>No problems found matching your active filters. Try clearing your search.</p>
                  ) : (
                    <>
                      <p>No topics added to this goal sheet yet.</p>
                      <button onClick={() => openAddTopicModal(currentGoal.id)} className="btn-theme-action" style={{ marginTop: '0.75rem' }}>
                        + Add First Topic
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="topics-sheet-list">
                  {filteredTopics.map(topic => {
                    const isTopicExpanded = expandedTopics.has(topic.id);
                    const subtopics = topic.displayedSubtopics || [];

                    // Calculate total leaf problems for this topic
                    const topicLeaves = subtopics.flatMap(s => s.displayedProblems || []);
                    const topicTotal = topicLeaves.length;
                    const topicDone = topicLeaves.filter(p => p.completed).length;
                    const topicProg = topicTotal > 0 ? Math.round((topicDone / topicTotal) * 100) : 0;

                    return (
                      <div key={topic.id} className="topic-accordion-item" id={`topic-item-${topic.id}`}>
                        {/* ── LEVEL 1: Topic Header Row ──────────────── */}
                        <div
                          className={`topic-header-row ${isTopicExpanded ? 'topic-header-row--expanded' : ''}`}
                          onClick={() => toggleTopic(topic.id)}
                        >
                          <div className="topic-header-left">
                            <span className={`topic-chevron ${isTopicExpanded ? 'topic-chevron--open' : ''}`}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"/>
                              </svg>
                            </span>
                            <span className="topic-title">{topic.title}</span>
                          </div>

                          <div className="topic-header-right" onClick={(e) => e.stopPropagation()}>
                            {/* Sleek Mini Progress Line & Count Fraction */}
                            <div className="topic-mini-progress-wrap">
                              <div className="topic-mini-progress-bar">
                                <div
                                  className="topic-mini-progress-fill"
                                  style={{ width: `${topicProg}%` }}
                                />
                              </div>
                              <span className="topic-count-fraction">
                                {topicDone} / {topicTotal}
                              </span>
                            </div>

                            {/* Actions Group */}
                            <div className="topic-actions-group">
                              <button
                                onClick={() => openNotesModal('topic', currentGoal.id, topic.id, null, topic.title, topic.notes)}
                                className={`icon-action-btn ${topic.notes ? 'icon-action-btn--active' : ''}`}
                                title="Topic Notes"
                              >
                                📝 {topic.notes ? '•' : ''}
                              </button>
                              <button
                                onClick={() => openResourcesModal('topic', currentGoal.id, topic.id, null, topic.title, topic.resources)}
                                className={`icon-action-btn ${topic.resources?.length > 0 ? 'icon-action-btn--active' : ''}`}
                                title="Topic Resources"
                              >
                                🔗 {topic.resources?.length > 0 ? topic.resources.length : ''}
                              </button>
                              <button
                                onClick={() => openEditTopicModal(currentGoal.id, topic)}
                                className="icon-action-btn"
                                title="Edit Topic"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteTopic(currentGoal.id, topic.id, topic.title)}
                                className="icon-action-btn"
                                style={{ color: 'var(--color-error)' }}
                                title="Delete Topic"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ── LEVEL 2: Subtopics (Chapters) Under Topic ── */}
                        {isTopicExpanded && (
                          <div className="subtopics-tree-wrapper">
                            {topic.description && (
                              <p className="topic-inner-desc">{topic.description}</p>
                            )}

                            {subtopics.length === 0 ? (
                              <p className="topic-inner-empty">
                                No chapters or subtopics yet. Add a chapter below.
                              </p>
                            ) : (
                              subtopics.map(subtopic => {
                                const isSubExpanded = expandedSubtopics.has(subtopic.id);
                                const problems = subtopic.displayedProblems || [];
                                const subDone = problems.filter(p => p.completed).length;
                                const subTotal = problems.length;

                                return (
                                  <div key={subtopic.id} className="subtopic-block" id={`subtopic-block-${subtopic.id}`}>
                                    {/* Curved Branch Header Line for Subtopic */}
                                    <div
                                      className="tree-branch-header"
                                      onClick={(e) => toggleSubtopic(subtopic.id, e)}
                                    >
                                      <div className="tree-branch-line">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1.6">
                                          <path d="M 6 0 L 6 12 Q 6 18 14 18 L 24 18"/>
                                        </svg>
                                      </div>
                                      <span className="tree-branch-title">
                                        <span className={`tree-chevron ${isSubExpanded ? 'tree-chevron--open' : ''}`}>
                                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                                        </span>
                                        <span>{subtopic.title}</span>
                                      </span>

                                      <div className="tree-branch-right" onClick={(e) => e.stopPropagation()}>
                                        <span className="tree-branch-fraction">
                                          {subDone} / {subTotal}
                                        </span>
                                        <button
                                          onClick={() => openEditSubtopicModal(currentGoal.id, topic.id, subtopic)}
                                          className="subtopic-mini-action-btn"
                                          title="Edit Chapter"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => handleDeleteSubtopic(currentGoal.id, topic.id, subtopic.id)}
                                          className="subtopic-mini-action-btn"
                                          title="Delete Chapter"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>

                                    {/* ── LEVEL 3: Sub-subtopics (Problems/Checklist) ─ */}
                                    {isSubExpanded && (
                                      <div className="subtopics-inner-panel">
                                        {problems.length === 0 ? (
                                          <p className="topic-inner-empty" style={{ margin: '0.25rem 0 0.5rem 0.5rem' }}>
                                            No problems in this chapter yet. Type below to add.
                                          </p>
                                        ) : (
                                          problems.map(problem => {
                                            const isBookmarked = bookmarkedIds.has(problem.id);
                                            const isMenuOpen = activeMenuId === problem.id;
                                            const hasNotes = Boolean(problem.notes && problem.notes.trim());
                                            const hasResources = Boolean(problem.resources && problem.resources.length > 0);
                                            const videoResource = problem.resources?.find(r => (r.type || '').toLowerCase() === 'video');

                                            return (
                                              <div
                                                key={problem.id}
                                                id={`problem-row-${problem.id}`}
                                                className={`subtopic-row ${problem.completed ? 'subtopic-row--completed' : ''}`}
                                              >
                                                {/* Checkbox & Problem Title */}
                                                <div className="subtopic-row-left">
                                                  <input
                                                    type="checkbox"
                                                    checked={Boolean(problem.completed)}
                                                    onChange={() => handleToggleProblem(currentGoal.id, topic.id, problem.id, problem.completed)}
                                                    className="subtopic-checkbox"
                                                    id={`problem-check-${problem.id}`}
                                                  />
                                                  <label
                                                    htmlFor={`problem-check-${problem.id}`}
                                                    className="subtopic-row-title"
                                                  >
                                                    {problem.title}
                                                  </label>
                                                  {problem.difficulty && (
                                                    <span className={`subtopic-diff-tag subtopic-diff-tag--${(problem.difficulty || '').toLowerCase()}`}>
                                                      {problem.difficulty}
                                                    </span>
                                                  )}
                                                  {problem.estimatedMinutes && (
                                                    <span style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
                                                      {problem.estimatedMinutes}m
                                                    </span>
                                                  )}
                                                </div>

                                                {/* 5 Compact Icons (Exact TakeUForward Replica) */}
                                                <div className="subtopic-row-right">
                                                  {/* Icon 1: Article/Doc (📄) */}
                                                  <button
                                                    onClick={() => openResourcesModal('problem', currentGoal.id, topic.id, problem.id, problem.title, problem.resources, 'Article')}
                                                    className={`subtopic-icon-btn ${hasResources ? 'subtopic-icon-btn--active' : ''}`}
                                                    title={hasResources ? `${problem.resources.length} learning resources attached` : 'Attach article or problem resource'}
                                                  >
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                      <polyline points="14 2 14 8 20 8"/>
                                                      <line x1="16" y1="13" x2="8" y2="13"/>
                                                      <line x1="16" y1="17" x2="8" y2="17"/>
                                                    </svg>
                                                  </button>

                                                  {/* Icon 2: YouTube Red Play (▶) */}
                                                  <button
                                                    onClick={() => {
                                                      if (videoResource) {
                                                        window.open(videoResource.url, '_blank', 'noopener,noreferrer');
                                                      } else {
                                                        openResourcesModal('problem', currentGoal.id, topic.id, problem.id, problem.title, problem.resources, 'Video');
                                                      }
                                                    }}
                                                    className="subtopic-youtube-btn"
                                                    title={videoResource ? `Watch video: ${videoResource.title}` : 'Attach YouTube or Video link'}
                                                  >
                                                    <svg width="18" height="14" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <rect width="24" height="18" rx="4.5" fill="#ef4444"/>
                                                      <polygon points="9.5,4.5 16.5,9 9.5,13.5" fill="#ffffff"/>
                                                    </svg>
                                                  </button>

                                                  {/* Icon 3: Notes (📝) */}
                                                  <button
                                                    onClick={() => openNotesModal('problem', currentGoal.id, topic.id, problem.id, problem.title, problem.notes)}
                                                    className={`subtopic-icon-btn ${hasNotes ? 'subtopic-icon-btn--highlight' : ''}`}
                                                    title={hasNotes ? 'View/edit personal notes' : 'Add preparation notes'}
                                                  >
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                  </button>

                                                  {/* Icon 4: Bookmark Ribbon (🔖) */}
                                                  <button
                                                    onClick={(e) => toggleBookmark(problem.id, e)}
                                                    className={`subtopic-icon-btn ${isBookmarked ? 'subtopic-icon-btn--bookmarked' : ''}`}
                                                    title={isBookmarked ? 'Bookmarked' : 'Bookmark this problem'}
                                                  >
                                                    <svg width="14" height="15" viewBox="0 0 24 24" fill={isBookmarked ? '#f59e0b' : 'none'} stroke={isBookmarked ? '#f59e0b' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                                    </svg>
                                                  </button>

                                                  {/* Icon 5: Three Dots Context Menu (⋮) */}
                                                  <div className="subtopic-menu-anchor" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                      onClick={() => setActiveMenuId(prev => (prev === problem.id ? null : problem.id))}
                                                      className="subtopic-icon-btn"
                                                      title="More options"
                                                    >
                                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                                        <circle cx="12" cy="5" r="2"/>
                                                        <circle cx="12" cy="12" r="2"/>
                                                        <circle cx="12" cy="19" r="2"/>
                                                      </svg>
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {isMenuOpen && (
                                                      <div className="subtopic-dropdown-menu">
                                                        <button onClick={() => openEditProblemModal(currentGoal.id, topic.id, problem)}>
                                                          ✏️ Edit Problem
                                                        </button>
                                                        <button onClick={() => openResourcesModal('problem', currentGoal.id, topic.id, problem.id, problem.title, problem.resources)}>
                                                          🔗 Resources ({problem.resources?.length || 0})
                                                        </button>
                                                        <button onClick={() => openNotesModal('problem', currentGoal.id, topic.id, problem.id, problem.title, problem.notes)}>
                                                          📝 Personal Notes
                                                        </button>
                                                        <div className="dropdown-divider" />
                                                        <button onClick={() => handleDeleteProblem(currentGoal.id, topic.id, problem.id)} className="dropdown-danger-item">
                                                          🗑️ Delete Problem
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                        )}

                                        {/* Inline Input to Add Sub-subtopic / Problem Under Subtopic */}
                                        <div className="inline-add-row">
                                          <input
                                            type="text"
                                            placeholder="+ Add problem / task to this chapter (press Enter)..."
                                            className="theme-inline-input"
                                            value={problemInputs[subtopic.id] || ''}
                                            onChange={(e) => setProblemInputs(prev => ({ ...prev, [subtopic.id]: e.target.value }))}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddProblemInline(currentGoal.id, topic.id, subtopic.id);
                                              }
                                            }}
                                          />
                                          <button
                                            onClick={() => handleAddProblemInline(currentGoal.id, topic.id, subtopic.id)}
                                            className="btn-theme-action"
                                          >
                                            + Add Problem
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}

                            {/* Inline Input to Add Chapter / Subtopic Under Topic */}
                            <div className="inline-add-chapter-row">
                              <input
                                type="text"
                                placeholder="+ Add a new chapter / subtopic to this topic (press Enter)..."
                                className="theme-inline-input"
                                value={subtopicInputs[topic.id] || ''}
                                onChange={(e) => setSubtopicInputs(prev => ({ ...prev, [topic.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSubtopicInline(currentGoal.id, topic.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleAddSubtopicInline(currentGoal.id, topic.id)}
                                className="btn-theme-primary btn-sm"
                              >
                                + Add Chapter
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Inline Rapid Input to Add a New Topic to this Goal */}
                  <div className="inline-add-topic-row">
                    <input
                      type="text"
                      placeholder="+ Add a new Topic to this goal (e.g. Dynamic Programming, System Design)... (press Enter)"
                      className="theme-inline-input"
                      value={topicInputInline}
                      onChange={(e) => setTopicInputInline(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopicInline();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddTopicInline}
                      className="btn-theme-primary btn-sm"
                    >
                      + Add Topic
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════
         MODAL 1: Create / Edit Goal Modal
         ══════════════════════════════════════════════════════════ */}
      {goalModalOpen && (
        <div className="theme-modal-overlay" onClick={() => setGoalModalOpen(false)}>
          <div className="theme-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h2>{editingGoal ? 'Edit Preparation Sheet' : 'Create New Preparation Sheet'}</h2>
              <button onClick={() => setGoalModalOpen(false)} className="icon-action-btn">✕</button>
            </div>
            <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="theme-form-group">
                <label>Sheet Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Striver's A2Z DSA Sheet or FAANG SDE Prep"
                  className="theme-form-input"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="theme-form-group">
                <label>Description / Learning Objective</label>
                <textarea
                  rows="3"
                  placeholder="Describe the topics, timeline, or target companies..."
                  className="theme-form-textarea"
                  value={goalForm.description}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="theme-form-row">
                <div className="theme-form-group">
                  <label>Category</label>
                  <select
                    className="theme-form-select"
                    value={goalForm.category}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="DSA & Algorithms">DSA & Algorithms</option>
                    <option value="System Design">System Design</option>
                    <option value="Core CS Fundamentals">Core CS Fundamentals</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Interview Practice">Interview Practice</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="theme-form-group">
                  <label>Priority</label>
                  <select
                    className="theme-form-select"
                    value={goalForm.priority}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="theme-form-row">
                <div className="theme-form-group">
                  <label>Status</label>
                  <select
                    className="theme-form-select"
                    value={goalForm.status}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="theme-form-group">
                  <label>Target Date</label>
                  <input
                    type="date"
                    className="theme-form-input"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="theme-modal-footer">
                <button type="button" onClick={() => setGoalModalOpen(false)} className="btn-theme-action">
                  Cancel
                </button>
                <button type="submit" className="btn-theme-primary">
                  {editingGoal ? 'Save Changes' : 'Create Sheet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
         MODAL 2: Add / Edit Topic Modal (Level 1)
         ══════════════════════════════════════════════════════════ */}
      {topicModalOpen && (
        <div className="theme-modal-overlay" onClick={() => setTopicModalOpen(false)}>
          <div className="theme-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h2>{editingTopic ? 'Edit Topic' : 'Add Topic'}</h2>
              <button onClick={() => setTopicModalOpen(false)} className="icon-action-btn">✕</button>
            </div>
            <form onSubmit={handleSaveTopic} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="theme-form-group">
                <label>Topic Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beginner Problems, Arrays, Binary Search, Dynamic Programming"
                  className="theme-form-input"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="theme-form-group">
                <label>Topic Description (optional)</label>
                <textarea
                  rows="2"
                  placeholder="Brief summary of concepts in this topic..."
                  className="theme-form-textarea"
                  value={topicForm.description}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="theme-modal-footer">
                <button type="button" onClick={() => setTopicModalOpen(false)} className="btn-theme-action">
                  Cancel
                </button>
                <button type="submit" className="btn-theme-primary">
                  {editingTopic ? 'Save Changes' : 'Add Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
         MODAL 3: Edit Subtopic Modal (Level 2: Chapter)
         ══════════════════════════════════════════════════════════ */}
      {subtopicModalOpen && (
        <div className="theme-modal-overlay" onClick={() => setSubtopicModalOpen(false)}>
          <div className="theme-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h2>Edit Chapter / Subtopic</h2>
              <button onClick={() => setSubtopicModalOpen(false)} className="icon-action-btn">✕</button>
            </div>
            <form onSubmit={handleSaveSubtopic} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="theme-form-group">
                <label>Chapter Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fundamentals of Programming, Language Basics"
                  className="theme-form-input"
                  value={subtopicForm.title}
                  onChange={(e) => setSubtopicForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="theme-form-group">
                <label>Chapter Description (optional)</label>
                <textarea
                  rows="2"
                  className="theme-form-textarea"
                  value={subtopicForm.description}
                  onChange={(e) => setSubtopicForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="theme-modal-footer">
                <button type="button" onClick={() => setSubtopicModalOpen(false)} className="btn-theme-action">
                  Cancel
                </button>
                <button type="submit" className="btn-theme-primary">
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
         MODAL 4: Edit Problem/Task Modal (Level 3: Leaf Item)
         ══════════════════════════════════════════════════════════ */}
      {problemModalOpen && (
        <div className="theme-modal-overlay" onClick={() => setProblemModalOpen(false)}>
          <div className="theme-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <h2>Edit Problem / Task</h2>
              <button onClick={() => setProblemModalOpen(false)} className="icon-action-btn">✕</button>
            </div>
            <form onSubmit={handleSaveProblem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="theme-form-group">
                <label>Problem Title *</label>
                <input
                  type="text"
                  required
                  className="theme-form-input"
                  value={problemForm.title}
                  onChange={(e) => setProblemForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="theme-form-row">
                <div className="theme-form-group">
                  <label>Difficulty</label>
                  <select
                    className="theme-form-select"
                    value={problemForm.difficulty}
                    onChange={(e) => setProblemForm(prev => ({ ...prev, difficulty: e.target.value }))}
                  >
                    <option value="Easy">Easy (Basic)</option>
                    <option value="Medium">Medium (Core)</option>
                    <option value="Hard">Hard (Pro)</option>
                  </select>
                </div>

                <div className="theme-form-group">
                  <label>Estimated Minutes</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 30"
                    className="theme-form-input"
                    value={problemForm.estimatedMinutes}
                    onChange={(e) => setProblemForm(prev => ({ ...prev, estimatedMinutes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="theme-modal-footer">
                <button type="button" onClick={() => setProblemModalOpen(false)} className="btn-theme-action">
                  Cancel
                </button>
                <button type="submit" className="btn-theme-primary">
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
         MODAL 5: Notes Modal (At All Levels)
         ══════════════════════════════════════════════════════════ */}
      {notesModalOpen && activeNotesTarget && (
        <div className="theme-modal-overlay" onClick={() => setNotesModalOpen(false)}>
          <div className="theme-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <div>
                <span className="sheet-badge sheet-badge--category" style={{ marginBottom: '0.25rem' }}>
                  {activeNotesTarget.level.toUpperCase()} NOTES
                </span>
                <h2>{activeNotesTarget.title}</h2>
              </div>
              <button onClick={() => setNotesModalOpen(false)} className="icon-action-btn">✕</button>
            </div>

            <div className="theme-form-group">
              <label>Personal Preparation Notes & Revision Tips</label>
              <textarea
                rows="8"
                placeholder="Write your approach, time/space complexity, edge cases..."
                className="theme-form-textarea"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
            </div>

            <div className="theme-modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={handleClearNotes}
                className="btn-theme-danger"
                disabled={notesSaving}
              >
                Clear Notes
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNotesModalOpen(false)}
                  className="btn-theme-action"
                  disabled={notesSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="btn-theme-primary"
                  disabled={notesSaving}
                >
                  {notesSaving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
         MODAL 6: Resources Modal (At All Levels)
         ══════════════════════════════════════════════════════════ */}
      {resourcesModalOpen && activeResourcesTarget && (
        <div className="theme-modal-overlay" onClick={() => setResourcesModalOpen(false)}>
          <div className="theme-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="theme-modal-header">
              <div>
                <span className="sheet-badge sheet-badge--category" style={{ marginBottom: '0.25rem' }}>
                  {activeResourcesTarget.level.toUpperCase()} RESOURCES
                </span>
                <h2>{activeResourcesTarget.title}</h2>
              </div>
              <button onClick={() => setResourcesModalOpen(false)} className="icon-action-btn">✕</button>
            </div>

            {/* List of existing resources */}
            <div className="theme-form-group">
              <label>Attached Learning Materials ({activeResourcesTarget.resources?.length || 0})</label>
              {(!activeResourcesTarget.resources || activeResourcesTarget.resources.length === 0) ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No resources attached yet. Add an article, video tutorial, or problem link below.
                </p>
              ) : (
                <div className="resources-list">
                  {activeResourcesTarget.resources.map(res => (
                    <div key={res.id} className="resource-item-row">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="sheet-badge" style={{ background: 'var(--color-surface-2)', color: 'var(--color-primary-600)' }}>
                            {res.type || 'Link'}
                          </span>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link-title"
                          >
                            {res.title} ↗
                          </a>
                        </div>
                        {res.description && (
                          <span style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>{res.description}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="btn-theme-danger"
                        title="Delete Resource"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Resource Form */}
            <form onSubmit={handleAddResource} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>+ Attach Learning Resource</span>

              <div className="theme-form-group">
                <label>Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Striver's Video Editorial or LeetCode problem"
                  className="theme-form-input"
                  value={newResourceForm.title}
                  onChange={(e) => setNewResourceForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="theme-form-group">
                <label>Web URL (must begin with http:// or https://) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="theme-form-input"
                  value={newResourceForm.url}
                  onChange={(e) => setNewResourceForm(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div className="theme-form-row">
                <div className="theme-form-group">
                  <label>Type</label>
                  <select
                    className="theme-form-select"
                    value={newResourceForm.type}
                    onChange={(e) => setNewResourceForm(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Course">Course</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Practice">Practice / Problem</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="theme-form-group">
                  <label>Short Description (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Best 15 min explanation"
                    className="theme-form-input"
                    value={newResourceForm.description}
                    onChange={(e) => setNewResourceForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="theme-modal-footer">
                <button
                  type="button"
                  onClick={() => setResourcesModalOpen(false)}
                  className="btn-theme-action"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn-theme-primary"
                  disabled={resourceSaving}
                >
                  {resourceSaving ? 'Adding...' : 'Attach Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
