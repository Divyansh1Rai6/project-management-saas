'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, LayoutGrid, List, FolderKanban, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageHeader } from '@/components/dashboard/page-header';
import { Modal } from '@/components/dashboard/modal';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { ProjectCard } from '@/components/dashboard/project-card';
import { ProjectStatusBadge } from '@/components/dashboard/badges';
import { AvatarGroup } from '@/components/dashboard/avatar-group';
import { LoadingButton } from '@/components/dashboard/loading-button';
import { ProjectCardSkeleton } from '@/components/dashboard/skeletons';
import { EmptyState, ErrorBanner } from '@/components/dashboard/empty-state';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { allProjects as initialProjects, workspaces as initialWorkspaces, members, type Project, type ProjectStatus } from '@/lib/mock-data';

const statusFilters: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'On Track', value: 'on-track' },
  { label: 'At Risk', value: 'at-risk' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Completed', value: 'completed' },
];

type Draft = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  workspace: string;
};

const emptyDraft: Draft = {
  id: '',
  name: '',
  description: '',
  status: 'on-track',
  workspace: 'Product',
};

const nameMaxLength = 80;
const descMaxLength = 200;

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects, hydrated] = useLocalStorage<Project[]>('flowbase.projects', initialProjects);
  const [workspaces] = useLocalStorage('flowbase.workspaces', initialWorkspaces);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [workspaceFilter, setWorkspaceFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesWorkspace = workspaceFilter === 'all' || p.workspace === workspaceFilter;
      return matchesSearch && matchesStatus && matchesWorkspace;
    });
  }, [projects, search, statusFilter, workspaceFilter]);

  const openCreate = () => {
    setDraft(emptyDraft);
    setIsEditing(false);
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setDraft({ id: p.id, name: p.name, description: p.description, status: p.status, workspace: p.workspace });
    setIsEditing(true);
    setErrors({});
    setFormError('');
    setModalOpen(true);
    setMenuOpen(null);
  };

  const validate = (): boolean => {
    const next: { name?: string; description?: string } = {};
    if (!draft.name.trim()) {
      next.name = 'Project name is required.';
    } else if (draft.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters.';
    } else if (draft.name.length > nameMaxLength) {
      next.name = `Name must be under ${nameMaxLength} characters.`;
    }
    if (draft.description.length > descMaxLength) {
      next.description = `Description must be under ${descMaxLength} characters.`;
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
          setProjects((prev) => prev.map((p) => (p.id === draft.id ? { ...p, name: draft.name, description: draft.description, status: draft.status, workspace: draft.workspace } : p)));
          toast({ title: 'Project updated', description: `"${draft.name}" has been saved.` });
        } else {
          const newP: Project = {
            id: `p${Date.now()}`,
            name: draft.name,
            description: draft.description || 'No description yet',
            status: draft.status,
            progress: 0,
            dueDate: 'TBD',
            workspace: draft.workspace,
            members: [members.am],
            taskCount: 0,
            completedTasks: 0,
          };
          setProjects((prev) => [newP, ...prev]);
          toast({ title: 'Project created', description: `"${draft.name}" has been added.` });
        }
        setModalOpen(false);
      } catch {
        toast({ title: 'Something went wrong', description: 'Could not save the project. Please try again.', variant: 'destructive' });
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
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast({ title: 'Project deleted', description: `"${deleteTarget.name}" has been removed.` });
        setDeleteTarget(null);
      } catch {
        toast({ title: 'Delete failed', description: 'Could not delete the project. Please try again.', variant: 'destructive' });
      } finally {
        setDeleting(false);
      }
    }, 350);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setWorkspaceFilter('all');
  };

  const workspaceNames = workspaces.map((w) => w.name);
  const hasActiveFilters = search || statusFilter !== 'all' || workspaceFilter !== 'all';

  return (
    <DashboardShell>
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          description="Track and manage all your projects across workspaces"
          breadcrumb={['Home', 'Projects']}
          actions={
            <LoadingButton icon={Plus} onClick={openCreate} size="md" className="px-3.5">
              New Project
            </LoadingButton>
          }
        />

        {/* Filters bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="h-9 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={workspaceFilter}
              onChange={(e) => setWorkspaceFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Workspaces</option>
              {workspaceNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setView('grid')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
                )}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                statusFilter === f.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {!hydrated ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <div key={p.id} className="relative group/card">
                  <div onClick={() => router.push(`/projects/${p.id}`)} className="cursor-pointer">
                    <ProjectCard project={p} index={i} />
                  </div>
                  <div className="absolute right-3 top-3 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === p.id ? null : p.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground opacity-0 shadow-sm transition-opacity hover:bg-muted group-hover/card:opacity-100"
                      aria-label="Project actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuOpen === p.id && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setMenuOpen(null); }} />
                        <div
                          className="absolute right-0 z-30 mt-1 w-36 rounded-lg border border-border bg-popover shadow-lg"
                          style={{ animation: 'scale-in 0.15s ease-out' }}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(null); setDeleteTarget(p); }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Project</th>
                    <th className="hidden px-4 py-3 md:table-cell">Status</th>
                    <th className="hidden px-4 py-3 lg:table-cell">Workspace</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Team</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3 text-right">Due</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/projects/${p.id}`)}
                      className="cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FolderKanban className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{p.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <ProjectStatusBadge status={p.status} />
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{p.workspace}</td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <AvatarGroup members={p.members} max={3} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">{p.dueDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <EmptyState
            icon={FolderKanban}
            title={hasActiveFilters ? 'No projects match your filters' : 'No projects yet'}
            description={hasActiveFilters ? 'Try adjusting your search or filters to find what you need.' : 'Create your first project to start tracking tasks and progress.'}
            actionLabel={hasActiveFilters ? 'Clear filters' : 'New Project'}
            onAction={hasActiveFilters ? clearFilters : openCreate}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Project' : 'Create Project'}
        description={isEditing ? 'Update your project details' : 'Start a new project in a workspace'}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <LoadingButton type="submit" loading={saving} onClick={handleSave}>
              {isEditing ? 'Save Changes' : 'Create Project'}
            </LoadingButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <ErrorBanner message={formError} onDismiss={() => setFormError('')} />}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Project Name</label>
            <input
              value={draft.name}
              onChange={(e) => {
                setDraft({ ...draft, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="e.g. Mobile App Redesign"
              className={cn(
                'h-9 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 transition-colors',
                errors.name
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-input focus:border-primary focus:ring-primary/20',
              )}
              autoFocus
            />
            {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => {
                setDraft({ ...draft, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Brief description of the project"
              rows={3}
              className={cn(
                'w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors',
                errors.description
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-input focus:border-primary focus:ring-primary/20',
              )}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.description ? (
                <p className="text-xs font-medium text-rose-600">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className={cn('text-xs', draft.description.length > descMaxLength ? 'text-rose-600' : 'text-muted-foreground')}>
                {draft.description.length}/{descMaxLength}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Workspace</label>
              <select
                value={draft.workspace}
                onChange={(e) => setDraft({ ...draft, workspace: e.target.value })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {workspaceNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
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

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete project?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? All tasks in this project will also be removed.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={confirmDelete}
      />
    </DashboardShell>
  );
}
