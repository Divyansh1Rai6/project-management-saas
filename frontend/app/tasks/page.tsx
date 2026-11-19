'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, ListTodo, Columns3, GripVertical, Trash2 } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageHeader } from '@/components/dashboard/page-header';
import { Modal } from '@/components/dashboard/modal';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { PriorityBadge, TaskStatusBadge } from '@/components/dashboard/badges';
import { LoadingButton } from '@/components/dashboard/loading-button';
import { TaskRowSkeleton } from '@/components/dashboard/skeletons';
import { EmptyState, ErrorBanner } from '@/components/dashboard/empty-state';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { allTasks as initialTasks, allProjects as initialProjects, members, type Task, type TaskStatus, type TaskPriority } from '@/lib/mock-data';

const priorityFilters: { label: string; value: TaskPriority | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const statusFilters: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' },
];

const columns: { key: TaskStatus; label: string; accent: string }[] = [
  { key: 'todo', label: 'To Do', accent: 'bg-slate-400' },
  { key: 'in-progress', label: 'In Progress', accent: 'bg-indigo-500' },
  { key: 'done', label: 'Completed', accent: 'bg-emerald-500' },
];

const priorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const statusOptions: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

const titleMaxLength = 120;
const descMaxLength = 500;

type Draft = {
  id: string;
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  description: string;
};

const emptyDraft: Draft = {
  id: '',
  title: '',
  project: 'Mobile App Redesign',
  status: 'todo',
  priority: 'medium',
  dueDate: 'Nov 20',
  description: '',
};

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks, hydrated] = useLocalStorage<Task[]>('flowbase.tasks', initialTasks);
  const [projects] = useLocalStorage('flowbase.projects', initialProjects);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.project.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, search, priorityFilter, statusFilter]);

  const projectNames = projects.map((p) => p.name);

  const openCreate = () => {
    setDraft({ ...emptyDraft, project: projectNames[0] ?? emptyDraft.project });
    setIsEditing(false);
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (t: Task) => {
    setDraft({
      id: t.id,
      title: t.title,
      project: t.project,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      description: t.description ?? '',
    });
    setIsEditing(true);
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const next: { title?: string; dueDate?: string } = {};
    if (!draft.title.trim()) {
      next.title = 'Task title is required.';
    } else if (draft.title.trim().length < 2) {
      next.title = 'Title must be at least 2 characters.';
    } else if (draft.title.length > titleMaxLength) {
      next.title = `Title must be under ${titleMaxLength} characters.`;
    }
    if (!draft.dueDate.trim()) {
      next.dueDate = 'A due date is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) {
      setFormError('Please fix the highlighted fields before saving.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      try {
        if (isEditing) {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === draft.id
                ? { ...t, title: draft.title, project: draft.project, status: draft.status, priority: draft.priority, dueDate: draft.dueDate, description: draft.description }
                : t,
            ),
          );
          toast({ title: 'Task updated', description: `"${draft.title}" has been saved.` });
        } else {
          const newT: Task = {
            id: `t${Date.now()}`,
            title: draft.title,
            project: draft.project,
            status: draft.status,
            priority: draft.priority,
            dueDate: draft.dueDate,
            assignee: members.am,
            description: draft.description,
          };
          setTasks((prev) => [newT, ...prev]);
          toast({ title: 'Task created', description: `"${draft.title}" has been added.` });
        }
        setModalOpen(false);
      } catch {
        toast({ title: 'Something went wrong', description: 'Could not save the task. Please try again.', variant: 'destructive' });
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setTimeout(() => {
      try {
        setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        toast({ title: 'Task deleted', description: `"${deleteTarget.title}" has been removed.` });
        setDeleteTarget(null);
      } catch {
        toast({ title: 'Delete failed', description: 'Could not delete the task. Please try again.', variant: 'destructive' });
      } finally {
        setDeleting(false);
      }
    }, 300);
  };

  const moveTask = (taskId: string, direction: 'left' | 'right') => {
    const order: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const idx = order.indexOf(t.status);
        const next = direction === 'left' ? Math.max(0, idx - 1) : Math.min(order.length - 1, idx + 1);
        return { ...t, status: order[next] };
      }),
    );
  };

  const toggleDone = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t)),
    );
  };

  const updateStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    const task = tasks.find((t) => t.id === taskId);
    if (task) toast({ title: 'Status updated', description: `"${task.title}" moved to ${status.replace('-', ' ')}.` });
  };

  const updatePriority = (taskId: string, priority: TaskPriority) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, priority } : t)));
    const task = tasks.find((t) => t.id === taskId);
    if (task) toast({ title: 'Priority updated', description: `"${task.title}" set to ${priority}.` });
  };

  const clearFilters = () => {
    setSearch('');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = search || priorityFilter !== 'all' || statusFilter !== 'all';

  return (
    <DashboardShell>
      <div className="space-y-6">
        <PageHeader
          title="My Tasks"
          description="Everything assigned to you, across all projects"
          breadcrumb={['Home', 'My Tasks']}
          actions={
            <LoadingButton icon={Plus} onClick={openCreate} size="md" className="px-3.5">
              New Task
            </LoadingButton>
          }
        />

        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="h-9 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setView('list')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <ListTodo className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setView('board')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                view === 'board' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Columns3 className="h-4 w-4" />
              Board
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {priorityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setPriorityFilter(f.value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                  priorityFilter === f.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-border" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {!hydrated ? (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="divide-y divide-border/60">
              {Array.from({ length: 6 }).map((_, i) => (
                <TaskRowSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : view === 'list' ? (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {filtered.length > 0 ? (
              <div className="divide-y divide-border/60">
                {filtered.map((task) => (
                  <div key={task.id} className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60">
                    <TaskRowControls task={task} onToggleDone={toggleDone} onMove={moveTask} onUpdateStatus={updateStatus} onUpdatePriority={updatePriority} />
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openEdit(task)}>
                      <p className={cn('truncate text-sm font-medium', task.status === 'done' && 'text-muted-foreground line-through')}>
                        {task.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{task.project}</p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      <select
                        value={task.priority}
                        onChange={(e) => updatePriority(task.id, e.target.value as TaskPriority)}
                        className="h-7 rounded-md border border-input bg-background px-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {priorityOptions.map((p) => (
                          <option key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </option>
                        ))}
                      </select>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <span className={cn('inline-flex shrink-0 items-center gap-1 text-xs font-medium', task.dueDate === 'Today' ? 'text-rose-600' : 'text-muted-foreground')}>
                      {task.dueDate}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(task); }}
                      className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ListTodo}
                title={hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
                description={hasActiveFilters ? 'Try adjusting your filters to find what you need.' : 'Create your first task to start tracking your work.'}
                actionLabel={hasActiveFilters ? 'Clear filters' : 'New Task'}
                onAction={hasActiveFilters ? clearFilters : openCreate}
                className="border-0"
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {columns.map((col) => {
              const colTasks = filtered.filter((t) => {
                if (col.key === 'todo') return t.status === 'todo' || t.status === 'review';
                if (col.key === 'in-progress') return t.status === 'in-progress';
                return t.status === 'done';
              });
              return (
                <div key={col.key} className="rounded-xl border border-border bg-muted/30 p-3">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2.5 w-2.5 rounded-full', col.accent)} />
                      <span className="text-sm font-semibold text-foreground">{col.label}</span>
                      <span className="rounded-md bg-card px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {colTasks.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => openEdit(task)}
                        className="group cursor-pointer rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-sm font-medium text-foreground', task.status === 'done' && 'text-muted-foreground line-through')}>
                            {task.title}
                          </p>
                          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{task.project}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <select
                            value={task.priority}
                            onChange={(e) => { e.stopPropagation(); updatePriority(task.id, e.target.value as TaskPriority); }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 rounded-md border border-input bg-background px-1.5 text-[11px] text-foreground focus:border-primary focus:outline-none"
                          >
                            {priorityOptions.map((p) => (
                              <option key={p} value={p}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                              </option>
                            ))}
                          </select>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-semibold text-white">
                            {task.assignee.initials}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                          <span className="text-[11px] text-muted-foreground">{task.dueDate}</span>
                          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'left'); }}
                              className="rounded px-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              ←
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'right'); }}
                              className="rounded px-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              →
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleDone(task.id); }}
                              className="rounded px-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              ✓
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteTarget(task); }}
                              className="rounded px-1 text-xs text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border/60 py-8 text-center text-xs text-muted-foreground">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Task' : 'Create Task'}
        description={isEditing ? 'Update task details' : 'Add a new task to track your work'}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <LoadingButton type="submit" loading={saving} onClick={handleSave}>
              {isEditing ? 'Save Changes' : 'Create Task'}
            </LoadingButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <ErrorBanner message={formError} onDismiss={() => setFormError('')} />}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Task Title</label>
            <input
              value={draft.title}
              onChange={(e) => {
                setDraft({ ...draft, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="e.g. Design new landing page"
              className={cn(
                'h-9 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 transition-colors',
                errors.title
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-input focus:border-primary focus:ring-primary/20',
              )}
              autoFocus
            />
            {errors.title && <p className="mt-1 text-xs font-medium text-rose-600">{errors.title}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Add more detail..."
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-1 text-right">
              <span className={cn('text-xs', draft.description.length > descMaxLength ? 'text-rose-600' : 'text-muted-foreground')}>
                {draft.description.length}/{descMaxLength}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Project</label>
              <select
                value={draft.project}
                onChange={(e) => setDraft({ ...draft, project: e.target.value })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {projectNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Due Date</label>
              <input
                value={draft.dueDate}
                onChange={(e) => {
                  setDraft({ ...draft, dueDate: e.target.value });
                  if (errors.dueDate) setErrors({ ...errors, dueDate: undefined });
                }}
                placeholder="e.g. Nov 20"
                className={cn(
                  'h-9 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 transition-colors',
                  errors.dueDate
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-input focus:border-primary focus:ring-primary/20',
                )}
              />
              {errors.dueDate && <p className="mt-1 text-xs font-medium text-rose-600">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Priority</label>
              <select
                value={draft.priority}
                onChange={(e) => setDraft({ ...draft, priority: e.target.value as TaskPriority })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <span className="text-xs text-muted-foreground">Current status:</span>
              <TaskStatusBadge status={draft.status} />
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete task?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={confirmDelete}
      />
    </DashboardShell>
  );
}

function TaskRowControls({
  task,
  onToggleDone,
}: {
  task: Task;
  onToggleDone: (id: string) => void;
  onMove: (id: string, dir: 'left' | 'right') => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onUpdatePriority: (id: string, priority: TaskPriority) => void;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggleDone(task.id); }}
      className="shrink-0"
      aria-label="Toggle complete"
    >
      <div className={cn(
        'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
        task.status === 'done' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-primary',
      )}>
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </button>
  );
}
