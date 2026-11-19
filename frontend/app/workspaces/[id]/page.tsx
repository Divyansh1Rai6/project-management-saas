'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FolderKanban, Users, CalendarDays, Plus, Pencil } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageHeader } from '@/components/dashboard/page-header';
import { ProjectCard } from '@/components/dashboard/project-card';
import { AvatarGroup } from '@/components/dashboard/avatar-group';
import { cn } from '@/lib/utils';
import { getWorkspaceById, getProjectsByWorkspace } from '@/lib/mock-data';

export default function WorkspaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const workspace = getWorkspaceById(id);

  if (!workspace) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-sm font-medium text-foreground">Workspace not found</p>
          <button
            onClick={() => router.push('/workspaces')}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Back to Workspaces
          </button>
        </div>
      </DashboardShell>
    );
  }

  const projects = getProjectsByWorkspace(workspace.name);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <button
          onClick={() => router.push('/workspaces')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </button>

        <PageHeader title={workspace.name} breadcrumb={['Home', 'Workspaces', workspace.name]} />

        {/* Workspace hero */}
        <div
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
          style={{ animation: 'fade-in 0.4s ease-out' }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-sm', workspace.color)}>
                <FolderKanban className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{workspace.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{workspace.description}</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 self-start rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FolderKanban className="h-3.5 w-3.5" />
                Projects
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">{workspace.projectCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Members
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">{workspace.memberCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Created
              </div>
              <p className="mt-1 text-sm font-bold text-foreground">{workspace.createdAt}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">Team</div>
              <div className="mt-1.5">
                <AvatarGroup members={workspace.members} />
              </div>
            </div>
          </div>
        </div>

        {/* Projects in workspace */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Projects in this Workspace</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{projects.length} projects</p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
              <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">No projects yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Create your first project in this workspace.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
