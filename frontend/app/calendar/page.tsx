'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageHeader } from '@/components/dashboard/page-header';
import { PriorityBadge } from '@/components/dashboard/badges';
import { cn } from '@/lib/utils';
import { allTasks, type Task } from '@/lib/mock-data';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const priorityDot: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-sky-500',
  high: 'bg-orange-500',
  urgent: 'bg-rose-500',
};

function isoKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CalendarPage() {
  const today = new Date(2026, 10, 11); // Nov 11, 2026
  const [current, setCurrent] = useState(new Date(2026, 10, 1));
  const [selectedKey, setSelectedKey] = useState<string>(isoKey(today));

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of allTasks) {
      if (!t.dueDateISO) continue;
      if (!map[t.dueDateISO]) map[t.dueDateISO] = [];
      map[t.dueDateISO].push(t);
    }
    return map;
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; currentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), currentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, cells.length - firstDay - daysInMonth + 1), currentMonth: false });
  }

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const selectedTasks = tasksByDate[selectedKey] ?? [];
  const selectedDate = new Date(selectedKey + 'T00:00:00');

  return (
    <DashboardShell>
      <div className="space-y-6">
        <PageHeader
          title="Calendar"
          description="See your tasks and deadlines across the month"
          breadcrumb={['Home', 'Calendar']}
          actions={
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">
              <Plus className="h-4 w-4" />
              New Event
            </button>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar grid */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6" style={{ animation: 'fade-in 0.4s ease-out' }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {MONTHS[month]} {year}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrent(new Date(2026, 10, 1));
                      setSelectedKey(isoKey(today));
                    }}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="pb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {day}
                  </div>
                ))}
                {cells.map((cell, i) => {
                  const key = isoKey(cell.date);
                  const cellTasks = tasksByDate[key] ?? [];
                  const isToday = isoKey(today) === key;
                  const isSelected = selectedKey === key;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedKey(key)}
                      className={cn(
                        'flex min-h-[64px] flex-col rounded-lg border p-1.5 text-left transition-all sm:min-h-[80px]',
                        cell.currentMonth ? 'border-border bg-background' : 'border-transparent bg-muted/20 text-muted-foreground',
                        isSelected && 'border-primary ring-1 ring-primary/30',
                        !isSelected && cell.currentMonth && 'hover:border-primary/30 hover:bg-muted/30',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                          isToday && cell.currentMonth && 'bg-primary text-primary-foreground',
                          !isToday && cell.currentMonth && 'text-foreground',
                          !cell.currentMonth && 'text-muted-foreground/60',
                        )}
                      >
                        {cell.date.getDate()}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-0.5">
                        {cellTasks.slice(0, 3).map((t) => (
                          <span
                            key={t.id}
                            className={cn('h-1.5 w-1.5 rounded-full', priorityDot[t.priority])}
                            title={t.title}
                          />
                        ))}
                        {cellTasks.length > 3 && (
                          <span className="text-[9px] font-medium text-muted-foreground">+{cellTasks.length - 3}</span>
                        )}
                      </div>
                      {cellTasks.length > 0 && cell.currentMonth && (
                        <div className="mt-1 hidden sm:block">
                          <p className="truncate text-[10px] text-muted-foreground">{cellTasks[0].title}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected day tasks */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm" style={{ animation: 'fade-in 0.4s ease-out 0.1s both' }}>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} due
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {selectedTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium text-foreground', task.status === 'done' && 'text-muted-foreground line-through')}>
                      {task.title}
                    </p>
                    <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', priorityDot[task.priority])} />
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{task.project}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <PriorityBadge priority={task.priority} />
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-semibold text-white">
                      {task.assignee.initials}
                    </div>
                  </div>
                </div>
              ))}
              {selectedTasks.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-10 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">No tasks due this day</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
