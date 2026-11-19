'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Menu, Plus, Check, MessageSquare, AlertTriangle, UserPlus, Settings, User, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifications as initialNotifications, currentUser } from '@/lib/mock-data';
import { GlobalSearch } from '@/components/dashboard/global-search';

const notifIcon = {
  message: MessageSquare,
  check: Check,
  alert: AlertTriangle,
  user: UserPlus,
};

const notifColor = {
  message: 'bg-sky-50 text-sky-600',
  check: 'bg-emerald-50 text-emerald-600',
  alert: 'bg-amber-50 text-amber-600',
  user: 'bg-indigo-50 text-indigo-600',
};

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifList, setNotifList] = useState(initialNotifications);

  const unreadCount = notifList.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifList((list) => list.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifList((list) => list.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const handleLogout = () => {
    setProfileOpen(false);
    router.push('/login');
  };

  const profileLinks = [
    { label: 'My Profile', href: '/settings', icon: User },
    { label: 'Account Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <GlobalSearch />

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-initial">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">New Project</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div
                className="absolute right-0 z-40 mt-2 w-80 origin-top-right rounded-xl border border-border bg-popover shadow-lg"
                style={{ animation: 'scale-in 0.2s ease-out' }}
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {unreadCount} new
                      </span>
                    )}
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifList.map((n) => {
                    const Icon = notifIcon[n.icon];
                    return (
                      <button
                        key={n.id}
                        onClick={() => toggleRead(n.id)}
                        className={cn(
                          'flex w-full gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50',
                          !n.read && 'bg-primary/[0.03]',
                        )}
                      >
                        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', notifColor[n.icon])}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-sm', n.read ? 'font-normal text-muted-foreground' : 'font-medium text-foreground')}>
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground/80">{n.time}</p>
                        </div>
                        <span
                          className={cn(
                            'mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors',
                            n.read ? 'bg-transparent ring-1 ring-inset ring-border' : 'bg-primary',
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
                <button className="w-full border-t border-border py-2.5 text-center text-sm font-medium text-primary transition-colors hover:bg-muted/50">
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white">
              {currentUser.initials}
            </div>
            <span className="hidden text-sm font-medium text-foreground lg:inline">{currentUser.name}</span>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
              <div
                className="absolute right-0 z-40 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover shadow-lg"
                style={{ animation: 'scale-in 0.2s ease-out' }}
              >
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {currentUser.role}
                  </span>
                </div>
                <div className="py-1">
                  {profileLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/60" />
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-border py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
