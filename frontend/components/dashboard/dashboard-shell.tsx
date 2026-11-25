
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
};

const DashboardUserContext = createContext<DashboardUser | null>(null);

export function useDashboardUser() {
  return useContext(DashboardUserContext);
}

export function DashboardGreeting() {
  const user = useDashboardUser();

  return (
    <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
      Good morning{user ? `, ${user.name}` : ''}
    </h1>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<DashboardUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCurrentUser() {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          console.error('Profile request failed:', response.status);
          return;
        }

        const result = await response.json();

        if (
          result.success &&
          result.user &&
          typeof result.user.id === 'string' &&
          typeof result.user.name === 'string' &&
          typeof result.user.email === 'string'
        ) {
          setUser(result.user);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Unable to fetch current user:', error);
        }
      }
    }

    fetchCurrentUser();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <DashboardUserContext.Provider value={user}>
      <div className="min-h-screen bg-muted/30">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />

        <div className="lg:pl-64">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />

          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardUserContext.Provider>
  );
}
