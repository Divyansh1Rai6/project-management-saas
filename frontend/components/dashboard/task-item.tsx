import { CheckCircle2, Circle, Clock, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/mock-data';
import { PriorityBadge } from './badges';

const statusIcon = {
  todo: Circle,
  'in-progress': Loader2,
  review: Eye,
  done: CheckCircle2,
};

const statusColor = {
  todo: 'text-slate-400',
  'in-progress': 'text-indigo-500',
  review: 'text-amber-500',
  done: 'text-emerald-500',
};

export function TaskItem({ task }: { task: Task }) {
  const Icon = statusIcon[task.status];
  const isDone = task.status === 'done';

  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60">
      <button className="shrink-0 transition-transform hover:scale-110">
        <Icon
          className={cn(
            'h-5 w-5',
            statusColor[task.status],
            task.status === 'in-progress' && 'animate-spin',
          )}
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-medium', isDone && 'text-muted-foreground line-through')}>
          {task.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{task.project}</p>
      </div>
      <div className="flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <PriorityBadge priority={task.priority} />
      </div>
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-1 text-xs font-medium',
          task.dueDate === 'Today' ? 'text-rose-600' : 'text-muted-foreground',
        )}
      >
        <Clock className="h-3 w-3" />
        {task.dueDate}
      </span>
    </div>
  );
}
