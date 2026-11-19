import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, LayoutGrid, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stat } from '@/lib/mock-data';

const iconMap = {
  layout: LayoutGrid,
  'check-circle': CheckCircle2,
  users: Users,
  clock: Clock,
};

export function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const Icon = iconMap[stat.icon];
  const isUp = stat.trend === 'up';

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ animation: `fade-in 0.4s ease-out ${index * 0.08}s both` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
          <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold',
            isUp ? 'text-emerald-600' : 'text-rose-600',
          )}
        >
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {stat.change}
        </span>
        <span className="text-xs text-muted-foreground">vs last week</span>
      </div>
    </div>
  );
}
