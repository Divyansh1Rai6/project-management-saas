import { ArrowRight, TrendingUp } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { ProjectCard } from '@/components/dashboard/project-card';
import { TaskItem } from '@/components/dashboard/task-item';
import { ProductivityChart } from '@/components/dashboard/productivity-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { stats, recentProjects, myTasks } from '@/lib/mock-data';

export default function Home() {
  const tasksTodo = myTasks.filter((t) => t.status !== 'done').length;

  return (
    <DashboardShell>
      <div className="space-y-6 lg:space-y-8">
        {/* Page header */}
        <div className="flex flex-col gap-1" style={{ animation: 'fade-in 0.4s ease-out' }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Workspaces</span>
            <span>/</span>
            <span>Product</span>
            <span>/</span>
            <span className="font-medium text-foreground">Dashboard</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                Good morning, Alex
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                You have <span className="font-semibold text-foreground">{tasksTodo} tasks</span> remaining today. Let&apos;s make progress.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-foreground">On a 12-day streak</span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

        {/* Productivity chart + Activity feed */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
          <div
            className="rounded-xl border border-border bg-card p-5 shadow-sm xl:col-span-2"
            style={{ animation: 'fade-in 0.4s ease-out 0.2s both' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">Weekly Productivity</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Tasks completed over the last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Tasks
                </span>
              </div>
            </div>
            <ProductivityChart />
          </div>

          <div
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
            style={{ animation: 'fade-in 0.4s ease-out 0.3s both' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Recent Activity</h2>
              <button className="text-xs font-medium text-primary hover:underline">View all</button>
            </div>
            <ActivityFeed />
          </div>
        </div>

        {/* Recent projects */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Projects you&apos;ve recently worked on</p>
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:gap-2">
              View all
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recentProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>

        {/* My tasks */}
        <div
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
            style={{ animation: 'fade-in 0.4s ease-out 0.4s both' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">My Tasks</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Tasks assigned to you across all projects</p>
              </div>
              <button className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:gap-2">
                View all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="divide-y divide-border/60">
              {myTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
      </div>
    </DashboardShell>
  );
}
