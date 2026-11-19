'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  FolderKanban,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Pencil,
  Plus,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageHeader } from '@/components/dashboard/page-header';
import { Modal } from '@/components/dashboard/modal';
import { ProjectStatusBadge, PriorityBadge, TaskStatusBadge } from '@/components/dashboard/badges';
import { AvatarGroup } from '@/components/dashboard/avatar-group';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { cn } from '@/lib/utils';
import { getProjectById, allTasks, workspaces, type Task, type ProjectStatus } from '@/lib/mock-data';

const statusIcon = {
  todo: Circle,
  'in-progress': Clock,
  review: Clock,
  done: CheckCircle2,
};

const statusColor = {
  todo: 'text-slate-400',
  'in-progress': 'text-indigo-500',
  review: 'text-amber-500',
  done: 'text-emerald-500',
};

type EditDraft = {
  name: string;
  description: string;
  status: ProjectStatus;
  workspace: string;
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const project = getProjectById(id);
  const [tasks, setTasks] = useState<Task[]>(project ? [...allTasks.filter((t) => t.projectId === id)] : []);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<EditDraft>({
    name: project?.name ?? '',
    description: project?.description ?? '',
    status: project?.status ?? 'on-track',
    workspace: project?.workspace ?? 'Product',
  });
  const [projectName, setProjectName] = useState(project?.name ?? '');
  const [projectDesc, setProjectDesc] = useState(project?.description ?? '');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(project?.status ?? 'on-track');

  if (!project) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-sm font-medium text-foreground">Project not found</p>
          <button onClick={() => router.push('/projects')} className="mt-3 text-sm font-medium text-primary hover:underline">
            Back to Projects
          </button>
        </div>
      </DashboardShell>
    );
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t)),
    );
  };

  const openEdit = () => {
    setDraft({ name: projectName, description: projectDesc, status: projectStatus, workspace: project.workspace });
    setEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    setProjectName(draft.name);
    setProjectDesc(draft.description);
    setProjectStatus(draft.status);
    setEditOpen(false);
  };

  const completed = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : project.progress;
  const memberList = project.members;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Breadcrumb with links */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/projects" className="transition-colors hover:text-foreground">Projects</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{projectName}</span>
        </nav>

        <button
          onClick={() => router.push('/projects')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </button>

        <PageHeader title={projectName} breadcrumb={undefined} />

        {/* Project header */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm" style={{ animation: 'fade-in 0.4s ease-out' }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FolderKanban className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{projectName}</h1>
                  <ProjectStatusBadge status={projectStatus} />
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{projectDesc}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Due {project.dueDate}
                  </span>
                  {project.startDate && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Started {project.startDate}
                    </span>
                  )}
                  <Link href={`/workspaces/${workspaces.find((w) => w.name === project.workspace)?.id ?? ''}`} className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
                    <FolderKanban className="h-3.5 w-3.5" />
                    {project.workspace}
                  </Link>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={openEdit}
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Pencil className="h-4 w-4" />
              Edit Project
            </button>
          </div>

          {/* Progress + team + tasks summary */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-semibold text-foreground">{progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Tasks
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">
                {completed}
                <span className="text-sm font-normal text-muted-foreground"> / {tasks.length} completed</span>
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Team
              </div>
              <div className="mt-2">
                <AvatarGroup members={memberList} size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks + sidebar (members + activity) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Tasks */}
          <div className="xl:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">Tasks</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{tasks.length} tasks in this project</p>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
              <div className="divide-y divide-border/60">
                {tasks.map((task) => {
                  const Icon = statusIcon[task.status];
                  const isDone = task.status === 'done';
                  return (
                    <div key={task.id} className="group flex items-center gap-3 py-2.5">
                      <button onClick={() => toggleTask(task.id)} className="shrink-0 transition-transform hover:scale-110">
                        <Icon className={cn('h-5 w-5', statusColor[task.status])} />
                      </button>
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => router.push(`/tasks/${task.id}`)}>
                        <p className={cn('truncate text-sm font-medium transition-colors group-hover:text-primary', isDone && 'text-muted-foreground line-through')}>
                          {task.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.dueDate}
                          </span>
                          <TaskStatusBadge status={task.status} />
                        </div>
                      </div>
                      <PriorityBadge priority={task.priority} />
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-semibold text-white" title={task.assignee.name}>
                        {task.assignee.initials}
                      </div>
                    </div>
                  );
                })}
                {tasks.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">No tasks in this project yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: members + activity */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-semibold text-foreground">Team Members</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{memberList.length} members</p>
              <div className="mt-4 space-y-2">
                {memberList.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white', m.color)}>
                      {m.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.id === 'am' ? 'Product Lead' : 'Team Member'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-foreground">Activity</h2>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Project"
        description="Update project details"
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
            <label className="mb-1.5 block text-sm font-medium text-foreground">Project Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">Workspace</label>
              <select
                value={draft.workspace}
                onChange={(e) => setDraft({ ...draft, workspace: e.target.value })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as ProjectStatus })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
