'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  Eye,
  Loader2,
  Pencil,
  ChevronRight,
  User,
  FileText,
  FolderKanban,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Modal } from '@/components/dashboard/modal';
import { PriorityBadge, TaskStatusBadge } from '@/components/dashboard/badges';
import { cn } from '@/lib/utils';
import { allTasks, allProjects, type TaskStatus, type TaskPriority } from '@/lib/mock-data';

const statusIcon = {
  todo: Circle,
  'in-progress': Loader2,
  review: Eye,
  done: CheckCircle2,
};

const statusColor: Record<TaskStatus, string> = {
  todo: 'text-slate-400',
  'in-progress': 'text-indigo-500',
  review: 'text-amber-500',
  done: 'text-emerald-500',
};

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
};

const priorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const statusOptions: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

type EditDraft = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const taskIndex = allTasks.findIndex((t) => t.id === id);
  const [task, setTask] = useState(allTasks[taskIndex] ? { ...allTasks[taskIndex] } : null);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<EditDraft>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
    dueDate: task?.dueDate ?? '',
  });

  if (!task) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-sm font-medium text-foreground">Task not found</p>
          <button onClick={() => router.push('/tasks')} className="mt-3 text-sm font-medium text-primary hover:underline">
            Back to Tasks
          </button>
        </div>
      </DashboardShell>
    );
  }

  const project = allProjects.find((p) => p.name === task.project);
  const Icon = statusIcon[task.status];

  const openEdit = () => {
    setDraft({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setTask({
      ...task,
      title: draft.title,
      description: draft.description,
      status: draft.status,
      priority: draft.priority,
      dueDate: draft.dueDate,
    });
    setEditOpen(false);
  };

  const cycleStatus = () => {
    const idx = statusOptions.indexOf(task.status);
    const next = statusOptions[(idx + 1) % statusOptions.length];
    setTask({ ...task, status: next });
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/tasks" className="transition-colors hover:text-foreground">My Tasks</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-medium text-foreground">{task.title}</span>
        </nav>

        <button
          onClick={() => router.push('/tasks')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Task header */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm" style={{ animation: 'fade-in 0.4s ease-out' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button onClick={cycleStatus} className="mt-0.5 shrink-0 transition-transform hover:scale-110" aria-label="Cycle status">
                    <Icon className={cn('h-6 w-6', statusColor[task.status], task.status === 'in-progress' && 'animate-spin')} />
                  </button>
                  <div>
                    <h1 className={cn('text-xl font-bold tracking-tight text-foreground', task.status === 'done' && 'text-muted-foreground line-through')}>
                      {task.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <TaskStatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={openEdit}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              </div>

              {/* Description */}
              <div className="mt-6 border-t border-border pt-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Description
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {task.description || 'No description provided for this task.'}
                </p>
              </div>
            </div>

            {/* Project context */}
            {project && (
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  Linked Project
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:border-primary/30 hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{project.workspace}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar: details */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-foreground">Details</h2>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    Status
                  </span>
                  <TaskStatusBadge status={task.status} />
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Flag className="h-4 w-4" />
                    Priority
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>

                {/* Due date */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Due Date
                  </span>
                  <span className={cn('text-sm font-medium', task.dueDate === 'Today' ? 'text-rose-600' : 'text-foreground')}>
                    {task.dueDate}
                  </span>
                </div>

                {/* Assignee */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Assignee
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white', task.assignee.color)}>
                      {task.assignee.initials}
                    </div>
                    <span className="text-sm font-medium text-foreground">{task.assignee.name}</span>
                  </div>
                </div>

                {/* Project */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderKanban className="h-4 w-4" />
                    Project
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">{task.project}</span>
                </div>
              </div>
            </div>

            {/* Quick status changer */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-foreground">Change Status</h2>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((s) => {
                  const OptIcon = statusIcon[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setTask({ ...task, status: s })}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                        task.status === s
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted',
                      )}
                    >
                      <OptIcon className={cn('h-3.5 w-3.5', statusColor[s], s === 'in-progress' && 'animate-spin')} />
                      {statusLabel[s]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-foreground">Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Created 3 days ago
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Due {task.dueDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Task"
        description="Update task details"
        footer={
          <>
            <button onClick={() => setEditOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Cancel
            </button>
            <button onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Task Title</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{statusLabel[s]}</option>
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
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Due Date</label>
            <input
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              placeholder="e.g. Nov 20"
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
