import { Sparkles, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

const highlights = [
  'Track projects, tasks, and deadlines in one place',
  'Collaborate with your team in real time',
  'Visualize progress with beautiful dashboards',
];

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2.5 text-primary-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">Flowbase</span>
              <span className="text-[10px] font-medium text-white/70">Project Management</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-3xl font-bold leading-tight text-primary-foreground">
            The modern workspace for teams that ship.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Plan, track, and deliver your projects with a workspace your team will actually enjoy using.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-white/80" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-white/60">
          &copy; 2026 Flowbase, Inc. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-8 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm" style={{ animation: 'fade-in 0.4s ease-out' }}>
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">Flowbase</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
