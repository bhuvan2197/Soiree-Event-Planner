import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Sparkles,
  Columns,
  ListOrdered,
  User,
  AlertCircle,
  Check,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Badge from '../common/Badge';

export default function TimelineView({
  event,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onRegenerateRunOfShow,
  isGeneratingRos
}) {
  const [activeSubView, setActiveSubView] = useState('vertical'); // 'vertical' | 'kanban' | 'runOfShow'
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('All');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState('Booking Phase');
  const [newTaskDueDate, setNewTaskDueDate] = useState(event.date || '2026-03-15');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskOwner, setNewTaskOwner] = useState('Host');

  const phases = [
    'Early Planning',
    'Booking Phase',
    'Finalizing',
    'Final Week',
    'Event Day'
  ];

  // Handle ESC key for modal
  useEffect(() => {
    if (!showAddTaskModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAddTaskModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddTaskModal]);

  // Burgundy & Gold petal confetti trigger
  const triggerBurgundyConfetti = () => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#6D1A2B', '#9B3347', '#B8935A', '#FAF5EC', '#4A0F1C'],
      shapes: ['circle', 'square'],
      ticks: 200,
      gravity: 0.8
    });
  };

  const handleTaskCheck = (taskId, currentlyCompleted) => {
    if (!currentlyCompleted) {
      triggerBurgundyConfetti();
    }
    onToggleTask(taskId);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const cleanTitle = newTaskTitle.trim();
    if (!cleanTitle) return;
    const task = {
      id: 'task-' + Date.now(),
      title: cleanTitle.slice(0, 150),
      phase: newTaskPhase,
      dueDate: newTaskDueDate || event.date,
      priority: newTaskPriority,
      owner: (newTaskOwner || 'Host').trim().slice(0, 50),
      completed: false
    };
    onAddTask(task);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  const tasks = event.timeline || [];
  const runOfShow = event.runOfShow || [];

  const filteredTasks = selectedPhaseFilter === 'All'
    ? tasks
    : tasks.filter(t => t.phase === selectedPhaseFilter);

  // Check overdue
  const isOverdue = (dueDate, completed) => {
    if (completed || !dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      
      {/* Header & Sub-view Switcher */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Badge variant="gold" size="xs" className="mb-2">
            Backward-Planned Schedule
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soiree-burgundyDeep">
            Timeline & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-soiree-muted mt-1 max-w-xl">
            Count down to celebration day with phased milestone gates and hour-by-hour operational run-of-show.
          </p>
        </div>

        {/* View mode toggle pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-soiree-bg p-1 rounded-2xl border border-soiree-sand flex items-center">
            <button
              onClick={() => setActiveSubView('vertical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubView === 'vertical'
                  ? 'bg-soiree-burgundy text-[#FAF5EC] shadow-sm'
                  : 'text-soiree-ink hover:text-soiree-burgundy'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Phased Timeline</span>
            </button>

            <button
              onClick={() => setActiveSubView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubView === 'kanban'
                  ? 'bg-soiree-burgundy text-[#FAF5EC] shadow-sm'
                  : 'text-soiree-ink hover:text-soiree-burgundy'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setActiveSubView('runOfShow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubView === 'runOfShow'
                  ? 'bg-soiree-burgundy text-[#FAF5EC] shadow-sm'
                  : 'text-soiree-ink hover:text-soiree-burgundy'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-soiree-gold" />
              <span>Run-of-Show</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs font-semibold shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div
          className="fixed inset-0 z-50 bg-soiree-burgundyDeep/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-milestone-title"
        >
          <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 max-w-md w-full shadow-luxury space-y-4">
            <h3 id="add-milestone-title" className="font-serif text-xl font-bold text-soiree-burgundyDeep">
              Add New Milestone
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="task-title-input" className="block text-xs font-semibold text-soiree-muted mb-1">Task Title</label>
                <input
                  id="task-title-input"
                  type="text"
                  required
                  placeholder="e.g. Schedule final floral arch fitting"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-soiree-sand bg-white p-2.5 text-sm outline-none focus:border-soiree-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="task-phase-select" className="block text-xs font-semibold text-soiree-muted mb-1">Phase</label>
                  <select
                    id="task-phase-select"
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy font-medium"
                  >
                    {phases.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="task-priority-select" className="block text-xs font-semibold text-soiree-muted mb-1">Priority</label>
                  <select
                    id="task-priority-select"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="task-duedate-input" className="block text-xs font-semibold text-soiree-muted mb-1">Target Due Date</label>
                  <input
                    id="task-duedate-input"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="task-owner-input" className="block text-xs font-semibold text-soiree-muted mb-1">Assigned Owner</label>
                  <input
                    id="task-owner-input"
                    type="text"
                    value={newTaskOwner}
                    onChange={(e) => setNewTaskOwner(e.target.value)}
                    placeholder="Host / Planner"
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-soiree-sand">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-xs text-soiree-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 1: Phased Vertical Timeline */}
      {activeSubView === 'vertical' && (
        <div className="space-y-8">
          
          {/* Phase Filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-serif italic text-soiree-muted mr-1">Filter by phase:</span>
            {['All', ...phases].map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhaseFilter(phase)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedPhaseFilter === phase
                    ? 'bg-soiree-burgundy text-[#FAF5EC] shadow-xs'
                    : 'bg-soiree-cream text-soiree-muted border border-soiree-sand hover:text-soiree-ink'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>

          {/* Grouped by Phases */}
          <div className="space-y-6">
            {phases
              .filter(p => selectedPhaseFilter === 'All' || selectedPhaseFilter === p)
              .map((phase, pIdx) => {
                const phaseTasks = tasks.filter(t => t.phase === phase);
                if (phaseTasks.length === 0 && selectedPhaseFilter !== 'All') return null;

                return (
                  <div key={phase} className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-soiree-sand pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-soiree-burgundy text-[#FAF5EC] text-xs font-serif font-bold flex items-center justify-center">
                          {pIdx + 1}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                          {phase}
                        </h3>
                      </div>
                      <span className="text-xs text-soiree-muted">
                        {phaseTasks.filter(t => t.completed).length} of {phaseTasks.length} done
                      </span>
                    </div>

                    <div className="space-y-3">
                      {phaseTasks.length === 0 ? (
                        <p className="text-xs text-soiree-muted italic py-2">
                          No milestones currently in this phase.
                        </p>
                      ) : (
                        phaseTasks.map((task) => {
                          const overdue = isOverdue(task.dueDate, task.completed);
                          return (
                            <div
                              key={task.id}
                              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                task.completed
                                  ? 'bg-soiree-bg/30 border-soiree-sand/60 opacity-75'
                                  : overdue
                                  ? 'bg-rose-50/50 border-soiree-rose/40'
                                  : 'bg-soiree-bg/70 border-soiree-sand hover:border-soiree-burgundy/40'
                              }`}
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => handleTaskCheck(task.id, task.completed)}
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                    task.completed
                                      ? 'bg-soiree-burgundy border-soiree-burgundy text-[#FAF5EC]'
                                      : 'border-soiree-sand bg-white hover:border-soiree-burgundy'
                                  }`}
                                  title="Toggle status"
                                >
                                  {task.completed && <Check className="w-3.5 h-3.5" />}
                                </button>

                                <div className="min-w-0">
                                  <p className={`text-sm font-medium leading-tight truncate ${
                                    task.completed ? 'line-through text-soiree-muted' : 'text-soiree-ink'
                                  }`}>
                                    {task.title}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-soiree-muted mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-soiree-rose" />
                                      {task.dueDate}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3 text-soiree-muted" />
                                      {task.owner}
                                    </span>
                                    {overdue && (
                                      <>
                                        <span>•</span>
                                        <span className="text-soiree-rose font-semibold flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" /> Overdue
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <Badge
                                  variant={task.priority === 'High' ? 'rose' : (task.priority === 'Medium' ? 'sand' : 'gold')}
                                  size="xs"
                                >
                                  {task.priority}
                                </Badge>
                                <button
                                  onClick={() => onDeleteTask(task.id)}
                                  className="text-soiree-muted/40 hover:text-soiree-rose p-1 transition-colors"
                                  title="Delete task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 2: Kanban Board */}
      {activeSubView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {phases.map((phase) => {
            const phaseTasks = tasks.filter(t => t.phase === phase);
            return (
              <div
                key={phase}
                className="bg-soiree-cream rounded-2xl border border-soiree-sand p-4 shadow-sm min-w-[240px] flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-soiree-sand pb-2 mb-3">
                  <h4 className="font-serif text-sm font-bold text-soiree-burgundyDeep">
                    {phase}
                  </h4>
                  <span className="text-[11px] font-semibold text-soiree-muted bg-soiree-bg px-2 py-0.5 rounded-full">
                    {phaseTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px]">
                  {phaseTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-xl border bg-soiree-bg/80 text-xs space-y-1.5 transition-all ${
                        t.completed ? 'opacity-60 border-soiree-sand line-through' : 'border-soiree-sand shadow-xs hover:border-soiree-burgundy'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-medium text-soiree-ink leading-snug">
                          {t.title}
                        </span>
                        <button
                          onClick={() => handleTaskCheck(t.id, t.completed)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            t.completed ? 'bg-soiree-burgundy text-white' : 'border-soiree-sand bg-white'
                          }`}
                        >
                          {t.completed && <Check className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-soiree-muted">
                        <span>{t.dueDate}</span>
                        <Badge variant={t.priority === 'High' ? 'rose' : 'sand'} size="xs">
                          {t.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: Event Day Run-of-Show */}
      {activeSubView === 'runOfShow' && (
        <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-soiree-sand pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-soiree-rose" />
                <h3 className="font-serif text-xl font-bold text-soiree-burgundyDeep">
                  Hour-by-Hour Event Day Run-of-Show
                </h3>
              </div>
              <p className="text-xs text-soiree-muted mt-1">
                A synchronized production itinerary from initial vendor staging to final guest departure.
              </p>
            </div>

            <button
              onClick={onRegenerateRunOfShow}
              disabled={isGeneratingRos}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-soiree-sand bg-soiree-bg hover:bg-soiree-sand text-xs font-semibold text-soiree-burgundy transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-soiree-gold" />
              <span>{isGeneratingRos ? 'Synthesizing...' : 'Re-craft Itinerary with AI'}</span>
            </button>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-soiree-sand/80 space-y-6">
            {runOfShow.map((item, index) => (
              <div key={item.id || index} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-soiree-burgundy border-4 border-soiree-cream group-hover:scale-125 transition-transform" />

                <div className="bg-soiree-bg/70 rounded-2xl border border-soiree-sand p-4 hover:border-soiree-burgundy/40 transition-colors shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-serif text-sm font-bold text-soiree-burgundy">
                      {item.time}
                    </span>
                    <span className="text-xs font-medium text-soiree-muted px-2 py-0.5 rounded-full bg-soiree-sand/40">
                      📍 {item.location}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-soiree-burgundyDeep">
                    {item.title}
                  </h4>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-soiree-muted">
                    <span className="font-semibold text-soiree-ink">Lead: {item.leadPerson}</span>
                    <span>•</span>
                    <span className="italic">{item.notes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
