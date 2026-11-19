'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2,
  HeartHandshake,
  Layers,
  Megaphone,
  Palette,
  Plus,
  Search,
  Settings2,
  Pencil,
  FolderKanban,
  Users,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageHeader } from '@/components/dashboard/page-header';
import { Modal } from '@/components/dashboard/modal';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { AvatarGroup } from '@/components/dashboard/avatar-group';
import { LoadingButton } from '@/components/dashboard/loading-button';
import { WorkspaceCardSkeleton } from '@/components/dashboard/skeletons';
import { EmptyState, ErrorBanner } from '@/components/dashboard/empty-state';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { workspaces as initialWorkspaces, members, type Workspace } from '@/lib/mock-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers,
  Code2,
  Megaphone,
  HeartHandshake,
  Settings2,
  Palette,
};

const iconOptions = ['Layers', 'Code2', 'Megaphone', 'HeartHandshake', 'Settings2', 'Palette'];
const colorOptions = [
  { label: 'Indigo', value: 'bg-indigo-500' },
  { label: 'Emerald', value: 'bg-emerald-500' },
  { label: 'Amber', value: 'bg-amber-500' },
  { label: 'Sky', value: 'bg-sky-500' },
  { label: 'Rose', value: 'bg-rose-500' },
  { label: 'Violet', value: 'bg-violet-500' },
];

const nameMaxLength = 60;
const descMaxLength = 200;

type Draft = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
};

const emptyDraft: Draft = { id: '', name: '', description: '', color: 'bg-indigo-500', icon: 'Layers' };

export default function WorkspacesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [workspaces, setWorkspaces, hydrated] = useLocalStorage<Workspace[]>('flowbase.workspaces', initialWorkspaces);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Workspace | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [formError, setFormError] = useState('');

  const filtered = workspaces.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setDraft(emptyDraft);
    setIsEditing(false);
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (w: Workspace) => {
    setDraft({ id: w.id, name: w.name, description: w.description, color: w.color, icon: w.icon });
    setIsEditing(true);
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const next: { name?: string; description?: string } = {};
    if (!draft.name.trim()) {
      next.name = 'Workspace name is required.';
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
          setWorkspaces((prev) =>
            prev.map((w) =>
              w.id === draft.id ? { ...w, name: draft.name, description: draft.description, color: draft.color, icon: draft.icon } : w,
            ),
          );
          toast({ title: 'Workspace updated', description: `"${draft.name}" has been saved.` });
        } else {
          const newW: Workspace = {
            id: `w${Date.now()}`,
            name: draft.name,
            description: draft.description || 'No description yet',
            color: draft.color,
            icon: draft.icon,
            projectCount: 0,
            memberCount: 1,
            members: [members.am],
            createdAt: 'Just now',
          };
          setWorkspaces((prev) => [newW, ...prev]);
          toast({ title: 'Workspace created', description: `"${draft.name}" is ready to use.` });
        }
        setModalOpen(false);
      } catch {
        toast({ title: 'Something went wrong', description: 'Could not save the workspace. Please try again.', variant: 'destructive' });
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
        setWorkspaces((prev) => prev.filter((w) => w.id !== deleteTarget.id));
        toast({ title: 'Workspace deleted', description: `"${deleteTarget.name}" has been removed.` });
        setDeleteTarget(null);
      } catch {
        toast({ title: 'Delete failed', description: 'Could not delete the workspace. Please try again.', variant: 'destructive' });
      } finally {
        setDeleting(false);
      }
    }, 350);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <PageHeader
          title="Workspaces"
          description="Organize projects and teams into shared workspaces"
          breadcrumb={['Home', 'Workspaces']}
          actions={
            <LoadingButton icon={Plus} onClick={openCreate} size="md" className="px-3.5">
              New Workspace
            </LoadingButton>
          }
        />

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspaces..."
            className="h-9 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        {!hydrated ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <WorkspaceCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((w, i) => {
              const Icon = iconMap[w.icon] ?? Layers;
              return (
                <div
                  key={w.id}
                  className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                  style={{ animation: `fade-in 0.4s ease-out ${i * 0.06}s both` }}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg text-white shadow-sm', w.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(w)}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Edit workspace"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(w)}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Delete workspace"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-4 font-semibold text-foreground">{w.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{w.description}</p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <FolderKanban className="h-3.5 w-3.5" />
                      {w.projectCount} projects
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {w.memberCount} members
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <AvatarGroup members={w.members} />
                    <button
                      onClick={() => router.push(`/workspaces/${w.id}`)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:gap-2"
                    >
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title={search ? 'No workspaces match your search' : 'No workspaces yet'}
            description={search ? 'Try a different search term to find what you need.' : 'Create your first workspace to start organizing projects and teams.'}
            actionLabel={search ? 'Clear search' : 'New Workspace'}
            onAction={search ? () => setSearch('') : openCreate}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Workspace' : 'Create Workspace'}
        description={isEditing ? 'Update your workspace details' : 'Set up a new shared workspace for your team'}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <LoadingButton type="submit" loading={saving} onClick={handleSave}>
              {isEditing ? 'Save Changes' : 'Create Workspace'}
            </LoadingButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <ErrorBanner message={formError} onDismiss={() => setFormError('')} />}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Workspace Name</label>
            <input
              value={draft.name}
              onChange={(e) => {
                setDraft({ ...draft, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="e.g. Product Team"
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
              placeholder="What is this workspace for?"
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => {
                const OptIcon = iconMap[icon];
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setDraft({ ...draft, icon })}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all',
                      draft.icon === icon
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <OptIcon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setDraft({ ...draft, color: c.value })}
                  className={cn(
                    'h-8 w-8 rounded-full transition-all',
                    c.value,
                    draft.color === c.value ? 'ring-2 ring-offset-2 ring-foreground' : 'hover:scale-110',
                  )}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete workspace?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={confirmDelete}
      />
    </DashboardShell>
  );
}
