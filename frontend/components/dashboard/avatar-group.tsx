import { cn } from '@/lib/utils';
import type { Member } from '@/lib/mock-data';

export function AvatarGroup({ members, max = 4, size = 'sm' }: { members: Member[]; max?: number; size?: 'sm' | 'md' }) {
  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((m) => (
        <div
          key={m.id}
          className={cn(
            'flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-background',
            sizeClass,
            m.color,
          )}
          title={m.name}
        >
          {m.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground ring-2 ring-background',
            sizeClass,
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
