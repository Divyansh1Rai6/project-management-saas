'use client';

import { useState } from 'react';
import { User, Lock, Bell, Building2, Check, Camera } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PageHeader } from '@/components/dashboard/page-header';
import { cn } from '@/lib/utils';
import { currentUser, workspaces } from '@/lib/mock-data';

const tabs = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'password', label: 'Password', icon: Lock },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'workspace', label: 'Workspace', icon: Building2 },
] as const;

type TabKey = (typeof tabs)[number]['key'];

const notifPreferences = [
  { key: 'task-assigned', label: 'Task assigned to you', description: 'Get notified when someone assigns you a task', defaultOn: true },
  { key: 'task-comment', label: 'Comments on your tasks', description: 'Receive alerts when someone comments on your task', defaultOn: true },
  { key: 'project-updates', label: 'Project updates', description: 'Weekly summary of project progress and changes', defaultOn: true },
  { key: 'deadline-reminders', label: 'Deadline reminders', description: 'Reminders before a task is due', defaultOn: true },
  { key: 'team-mentions', label: 'Team mentions', description: 'When a teammate mentions you in a comment', defaultOn: false },
  { key: 'marketing', label: 'Product news & tips', description: 'Occasional updates about new features', defaultOn: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    bio: 'Product lead focused on building delightful tools for teams. Coffee enthusiast.',
    timezone: 'Pacific Time (PT)',
  });
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(notifPreferences.map((n) => [n.key, n.defaultOn])),
  );
  const [defaultWorkspace, setDefaultWorkspace] = useState(workspaces[0]?.id ?? '');
  const [saved, setSaved] = useState(false);

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your account, preferences, and workspace"
          breadcrumb={['Home', 'Settings']}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
          {/* Tab nav */}
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    activeTab === tab.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Tab content */}
          <div className="min-w-0">
            {activeTab === 'profile' && (
              <div
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                style={{ animation: 'fade-in 0.3s ease-out' }}
              >
                <h2 className="text-lg font-semibold text-foreground">Profile</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Update your personal information and photo</p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold text-white">
                      {currentUser.initials}
                    </div>
                    <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-110">
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <button className="mt-1 text-xs font-medium text-primary hover:underline">Change photo</button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                    <input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
                    <input
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option>Pacific Time (PT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Central Time (CT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Greenwich Mean Time (GMT)</option>
                      <option>Central European Time (CET)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                  <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    Cancel
                  </button>
                  <button
                    onClick={triggerSaved}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {saved && <Check className="h-4 w-4" />}
                    {saved ? 'Saved' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                style={{ animation: 'fade-in 0.3s ease-out' }}
              >
                <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Keep your account secure with a strong password</p>

                <div className="mt-6 max-w-md space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label>
                    <input
                      type="password"
                      value={password.current}
                      onChange={(e) => setPassword({ ...password, current: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
                    <input
                      type="password"
                      value={password.next}
                      onChange={(e) => setPassword({ ...password, next: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm New Password</label>
                    <input
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                  <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setPassword({ current: '', next: '', confirm: '' });
                      triggerSaved();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {saved && <Check className="h-4 w-4" />}
                    {saved ? 'Updated' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                style={{ animation: 'fade-in 0.3s ease-out' }}
              >
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Choose what you want to be notified about</p>

                <div className="mt-6 divide-y divide-border">
                  {notifPreferences.map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between py-4">
                      <div className="pr-4">
                        <p className="text-sm font-medium text-foreground">{pref.label}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <button
                        onClick={() => setPrefs((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                        className={cn(
                          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                          prefs[pref.key] ? 'bg-primary' : 'bg-muted',
                        )}
                        role="switch"
                        aria-checked={prefs[pref.key]}
                      >
                        <span
                          className={cn(
                            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                            prefs[pref.key] ? 'translate-x-[22px]' : 'translate-x-0.5',
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                  <button
                    onClick={triggerSaved}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {saved && <Check className="h-4 w-4" />}
                    {saved ? 'Saved' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'workspace' && (
              <div
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                style={{ animation: 'fade-in 0.3s ease-out' }}
              >
                <h2 className="text-lg font-semibold text-foreground">Workspace Settings</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Configure your default workspace and preferences</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Default Workspace</label>
                    <select
                      value={defaultWorkspace}
                      onChange={(e) => setDefaultWorkspace(e.target.value)}
                      className="h-9 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {workspaces.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-muted-foreground">This workspace opens by default when you sign in.</p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium text-foreground">Your Workspaces</p>
                    <div className="mt-3 space-y-2">
                      {workspaces.map((w) => (
                        <div key={w.id} className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                          <div className="flex items-center gap-2.5">
                            <span className={cn('h-2.5 w-2.5 rounded-full', w.color)} />
                            <span className="text-sm font-medium text-foreground">{w.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {w.projectCount} projects · {w.memberCount} members
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                  <button
                    onClick={triggerSaved}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {saved && <Check className="h-4 w-4" />}
                    {saved ? 'Saved' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
