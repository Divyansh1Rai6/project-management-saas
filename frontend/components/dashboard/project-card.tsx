import { CalendarDays, MoreHorizontal, FolderKanban } from 'lucide-react';
import type { Project } from '@/lib/mock-data';
import { ProjectStatusBadge } from './badges';
import { AvatarGroup } from './avatar-group';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
      style={{ animation: `fade-in 0.4s ease-out ${index * 0.08}s both` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">{project.name}</h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <button className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <ProjectStatusBadge status={project.status} />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          Due {project.dueDate}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-foreground">{project.progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <AvatarGroup members={project.members} />
        <span className="text-xs font-medium text-muted-foreground">
          {project.completedTasks}/{project.taskCount} tasks
        </span>
      </div>
    </div>
  );
}
