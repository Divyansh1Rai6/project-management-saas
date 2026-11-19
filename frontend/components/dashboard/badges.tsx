import { cn } from '@/lib/utils';
import type { ProjectStatus, TaskPriority, TaskStatus } from '@/lib/mock-data';

const projectStatusConfig: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  'on-track': { label: 'On Track', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'at-risk': { label: 'At Risk', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  delayed: { label: 'Delayed', className: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  completed: { label: 'Completed', className: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
};

const taskStatusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: 'To Do', className: 'bg-slate-100 text-slate-600' },
  'in-progress': { label: 'In Progress', className: 'bg-indigo-50 text-indigo-700' },
  review: { label: 'Review', className: 'bg-amber-50 text-amber-700' },
  done: { label: 'Done', className: 'bg-emerald-50 text-emerald-700' },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', className: 'bg-sky-50 text-sky-700' },
  high: { label: 'High', className: 'bg-orange-50 text-orange-700' },
  urgent: { label: 'Urgent', className: 'bg-rose-50 text-rose-700' },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = projectStatusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = taskStatusConfig[status];
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityConfig[priority];
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}
