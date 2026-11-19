import { recentActivity } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function ActivityFeed() {
  return (
    <div className="space-y-1">
      {recentActivity.map((a, i) => (
        <div
          key={a.id}
          className="flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
          style={{ animation: `fade-in 0.4s ease-out ${i * 0.06}s both` }}
        >
          <div className="relative flex flex-col items-center">
            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white', a.color)}>
              {a.initials}
            </div>
            {i < recentActivity.length - 1 && (
              <div className="absolute top-8 h-full w-px bg-border" />
            )}
          </div>
          <div className="min-w-0 flex-1 pb-3">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{a.actor}</span>{' '}
              <span className="text-muted-foreground">{a.action}</span>{' '}
              <span className="font-medium">{a.target}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
