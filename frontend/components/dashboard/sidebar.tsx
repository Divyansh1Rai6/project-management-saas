'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CheckSquare,
  FolderKanban,
  Layers,
  LayoutDashboard,
  Settings,
  ChevronsLeft,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/mock-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Layers,
  FolderKanban,
  CheckSquare,
  Calendar,
  Settings,
};

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-foreground">Flowbase</span>
              <span className="text-[10px] font-medium text-muted-foreground">Project Management</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close sidebar"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </span>
          <ul className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground group-hover:bg-background',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {active && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-foreground">Upgrade to Pro</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Unlock unlimited projects, advanced analytics, and priority support.
            </p>
            <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Upgrade Now
            </button>
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">Alex Morgan</p>
              <p className="truncate text-xs text-muted-foreground">Product Lead</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
