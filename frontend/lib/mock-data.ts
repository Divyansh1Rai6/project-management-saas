export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'on-track' | 'at-risk' | 'delayed' | 'completed';

export type Member = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  workspace: string;
  members: Member[];
  taskCount: number;
  completedTasks: number;
  startDate?: string;
  tags?: string[];
};

export type Workspace = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  projectCount: number;
  memberCount: number;
  members: Member[];
  createdAt: string;
};

export type ProjectDetail = Project & {
  tasks: Task[];
  activity: Activity[];
};

export type Task = {
  id: string;
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: Member;
  dueDateISO?: string;
  description?: string;
  projectId?: string;
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: 'layout' | 'check-circle' | 'users' | 'clock';
};

export type Activity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  initials: string;
  color: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: 'message' | 'check' | 'alert' | 'user';
};

export const members: Record<string, Member> = {
  am: { id: 'am', name: 'Alex Morgan', initials: 'AM', color: 'bg-indigo-500' },
  jc: { id: 'jc', name: 'Jordan Chen', initials: 'JC', color: 'bg-emerald-500' },
  sr: { id: 'sr', name: 'Sam Rivera', initials: 'SR', color: 'bg-amber-500' },
  tp: { id: 'tp', name: 'Taylor Park', initials: 'TP', color: 'bg-rose-500' },
  nk: { id: 'nk', name: 'Nina Kovac', initials: 'NK', color: 'bg-sky-500' },
  el: { id: 'el', name: 'Emma Lee', initials: 'EL', color: 'bg-violet-500' },
};

export const currentUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@flowbase.io',
  initials: 'AM',
  role: 'Product Lead',
};

export const stats: Stat[] = [
  {
    id: 'projects',
    label: 'Active Projects',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: 'layout',
  },
  {
    id: 'tasks',
    label: 'Tasks Completed',
    value: '186',
    change: '+23%',
    trend: 'up',
    icon: 'check-circle',
  },
  {
    id: 'team',
    label: 'Team Members',
    value: '42',
    change: '+4%',
    trend: 'up',
    icon: 'users',
  },
  {
    id: 'hours',
    label: 'Hours This Week',
    value: '128h',
    change: '-8%',
    trend: 'down',
    icon: 'clock',
  },
];

export const recentProjects: Project[] = [
  {
    id: 'p1',
    name: 'Mobile App Redesign',
    description: 'Complete overhaul of the iOS and Android experience',
    status: 'on-track',
    progress: 72,
    dueDate: 'Nov 28',
    workspace: 'Product',
    members: [members.am, members.jc, members.sr],
    taskCount: 48,
    completedTasks: 35,
  },
  {
    id: 'p2',
    name: 'Q4 Marketing Launch',
    description: 'Holiday campaign across email, social, and web',
    status: 'at-risk',
    progress: 45,
    dueDate: 'Dec 10',
    workspace: 'Marketing',
    members: [members.tp, members.nk],
    taskCount: 32,
    completedTasks: 14,
  },
  {
    id: 'p3',
    name: 'Billing System Migration',
    description: 'Move from legacy invoicing to Stripe-based flow',
    status: 'delayed',
    progress: 28,
    dueDate: 'Nov 18',
    workspace: 'Engineering',
    members: [members.el, members.jc, members.am, members.sr],
    taskCount: 56,
    completedTasks: 16,
  },
  {
    id: 'p4',
    name: 'Customer Portal v2',
    description: 'Self-service dashboard for enterprise clients',
    status: 'on-track',
    progress: 89,
    dueDate: 'Dec 02',
    workspace: 'Engineering',
    members: [members.nk, members.el],
    taskCount: 41,
    completedTasks: 37,
  },
];

export const myTasks: Task[] = [
  {
    id: 't1',
    title: 'Finalize onboarding flow wireframes',
    project: 'Mobile App Redesign',
    status: 'in-progress',
    priority: 'high',
    dueDate: 'Today',
    assignee: members.am,
  },
  {
    id: 't2',
    title: 'Review Q4 campaign copy',
    project: 'Q4 Marketing Launch',
    status: 'review',
    priority: 'medium',
    dueDate: 'Tomorrow',
    assignee: members.am,
  },
  {
    id: 't3',
    title: 'Approve Stripe webhook integration',
    project: 'Billing System Migration',
    status: 'todo',
    priority: 'urgent',
    dueDate: 'Nov 13',
    assignee: members.am,
  },
  {
    id: 't4',
    title: 'Update component library docs',
    project: 'Customer Portal v2',
    status: 'todo',
    priority: 'low',
    dueDate: 'Nov 15',
    assignee: members.am,
  },
  {
    id: 't5',
    title: 'Sync with design on icon set',
    project: 'Mobile App Redesign',
    status: 'done',
    priority: 'medium',
    dueDate: 'Yesterday',
    assignee: members.am,
  },
  {
    id: 't6',
    title: 'Draft enterprise pricing tiers',
    project: 'Billing System Migration',
    status: 'in-progress',
    priority: 'high',
    dueDate: 'Nov 14',
    assignee: members.am,
  },
];

export const recentActivity: Activity[] = [
  {
    id: 'a1',
    actor: 'Jordan Chen',
    action: 'completed task',
    target: 'API authentication setup',
    time: '2h ago',
    initials: 'JC',
    color: 'bg-emerald-500',
  },
  {
    id: 'a2',
    actor: 'Sam Rivera',
    action: 'commented on',
    target: 'Onboarding wireframes',
    time: '4h ago',
    initials: 'SR',
    color: 'bg-amber-500',
  },
  {
    id: 'a3',
    actor: 'Taylor Park',
    action: 'created project',
    target: 'Q4 Marketing Launch',
    time: '6h ago',
    initials: 'TP',
    color: 'bg-rose-500',
  },
  {
    id: 'a4',
    actor: 'Nina Kovac',
    action: 'uploaded file to',
    target: 'Customer Portal v2',
    time: '1d ago',
    initials: 'NK',
    color: 'bg-sky-500',
  },
  {
    id: 'a5',
    actor: 'Emma Lee',
    action: 'moved task to review in',
    target: 'Billing Migration',
    time: '1d ago',
    initials: 'EL',
    color: 'bg-violet-500',
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New comment on your task',
    description: 'Sam Rivera commented on "Onboarding wireframes"',
    time: '5m ago',
    read: false,
    icon: 'message',
  },
  {
    id: 'n2',
    title: 'Task assigned to you',
    description: 'You were assigned to "Approve Stripe webhook"',
    time: '1h ago',
    read: false,
    icon: 'user',
  },
  {
    id: 'n3',
    title: 'Project at risk',
    description: 'Q4 Marketing Launch is behind schedule',
    time: '3h ago',
    read: false,
    icon: 'alert',
  },
  {
    id: 'n4',
    title: 'Task completed',
    description: 'Jordan Chen completed "API auth setup"',
    time: '5h ago',
    read: true,
    icon: 'check',
  },
];

export const weeklyProductivity = [
  { day: 'Mon', tasks: 12, hours: 7.5 },
  { day: 'Tue', tasks: 18, hours: 8.2 },
  { day: 'Wed', tasks: 15, hours: 6.8 },
  { day: 'Thu', tasks: 22, hours: 9.1 },
  { day: 'Fri', tasks: 19, hours: 7.9 },
  { day: 'Sat', tasks: 8, hours: 3.2 },
  { day: 'Sun', tasks: 5, hours: 2.1 },
];

export type NavItem = {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
  badge?: string;
};

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard', href: '/' },
  { label: 'Workspaces', icon: 'Layers', href: '/workspaces', badge: '6' },
  { label: 'Projects', icon: 'FolderKanban', href: '/projects', badge: '24' },
  { label: 'My Tasks', icon: 'CheckSquare', href: '/tasks', badge: '12' },
  { label: 'Calendar', icon: 'Calendar', href: '/calendar' },
  { label: 'Settings', icon: 'Settings', href: '/settings' },
];

export const workspaces: Workspace[] = [
  {
    id: 'w1',
    name: 'Product',
    description: 'Product strategy, design, and roadmap planning',
    color: 'bg-indigo-500',
    icon: 'Layers',
    projectCount: 8,
    memberCount: 12,
    members: [members.am, members.jc, members.sr, members.el],
    createdAt: 'Jan 2026',
  },
  {
    id: 'w2',
    name: 'Engineering',
    description: 'Core platform, infrastructure, and integrations',
    color: 'bg-emerald-500',
    icon: 'Code2',
    projectCount: 11,
    memberCount: 18,
    members: [members.jc, members.el, members.nk, members.am],
    createdAt: 'Jan 2026',
  },
  {
    id: 'w3',
    name: 'Marketing',
    description: 'Campaigns, content, brand, and growth',
    color: 'bg-amber-500',
    icon: 'Megaphone',
    projectCount: 6,
    memberCount: 7,
    members: [members.tp, members.nk, members.sr],
    createdAt: 'Feb 2026',
  },
  {
    id: 'w4',
    name: 'Customer Success',
    description: 'Onboarding, support, and client retention',
    color: 'bg-sky-500',
    icon: 'HeartHandshake',
    projectCount: 4,
    memberCount: 9,
    members: [members.sr, members.tp],
    createdAt: 'Mar 2026',
  },
  {
    id: 'w5',
    name: 'Operations',
    description: 'Internal tooling, finance, and people ops',
    color: 'bg-rose-500',
    icon: 'Settings2',
    projectCount: 3,
    memberCount: 5,
    members: [members.el, members.am],
    createdAt: 'Apr 2026',
  },
  {
    id: 'w6',
    name: 'Design Systems',
    description: 'Shared component library and brand guidelines',
    color: 'bg-violet-500',
    icon: 'Palette',
    projectCount: 2,
    memberCount: 6,
    members: [members.sr, members.el, members.nk],
    createdAt: 'May 2026',
  },
];

export const allProjects: Project[] = [
  ...recentProjects,
  {
    id: 'p5',
    name: 'Analytics Dashboard',
    description: 'Real-time metrics and reporting for enterprise',
    status: 'on-track',
    progress: 61,
    dueDate: 'Dec 15',
    workspace: 'Engineering',
    members: [members.jc, members.nk],
    taskCount: 38,
    completedTasks: 23,
    startDate: 'Oct 20',
    tags: ['analytics', 'enterprise'],
  },
  {
    id: 'p6',
    name: 'Brand Refresh 2026',
    description: 'New visual identity and marketing site redesign',
    status: 'on-track',
    progress: 54,
    dueDate: 'Dec 20',
    workspace: 'Marketing',
    members: [members.sr, members.tp, members.el],
    taskCount: 29,
    completedTasks: 16,
    startDate: 'Oct 28',
    tags: ['brand', 'design'],
  },
  {
    id: 'p7',
    name: 'Onboarding Flow v3',
    description: 'Guided product tour and activation improvements',
    status: 'at-risk',
    progress: 38,
    dueDate: 'Nov 25',
    workspace: 'Product',
    members: [members.am, members.sr],
    taskCount: 24,
    completedTasks: 9,
    startDate: 'Oct 15',
    tags: ['onboarding', 'activation'],
  },
  {
    id: 'p8',
    name: 'API Rate Limiting',
    description: 'Tiered rate limits and quota management',
    status: 'completed',
    progress: 100,
    dueDate: 'Nov 05',
    workspace: 'Engineering',
    members: [members.jc, members.el],
    taskCount: 18,
    completedTasks: 18,
    startDate: 'Sep 20',
    tags: ['api', 'infrastructure'],
  },
  {
    id: 'p9',
    name: 'Customer Feedback Loop',
    description: 'NPS surveys and feedback-driven roadmap input',
    status: 'on-track',
    progress: 67,
    dueDate: 'Dec 08',
    workspace: 'Customer Success',
    members: [members.sr, members.tp, members.nk],
    taskCount: 21,
    completedTasks: 14,
    startDate: 'Oct 10',
    tags: ['feedback', 'nps'],
  },
  {
    id: 'p10',
    name: 'Design Tokens Migration',
    description: 'Centralized design tokens across all platforms',
    status: 'delayed',
    progress: 22,
    dueDate: 'Nov 22',
    workspace: 'Design Systems',
    members: [members.el, members.sr],
    taskCount: 34,
    completedTasks: 8,
    startDate: 'Oct 01',
    tags: ['design-system', 'tokens'],
  },
];

export const allTasks: Task[] = [
  {
    id: 't1',
    title: 'Finalize onboarding flow wireframes',
    project: 'Mobile App Redesign',
    projectId: 'p1',
    status: 'in-progress',
    priority: 'high',
    dueDate: 'Today',
    dueDateISO: '2026-11-11',
    assignee: members.am,
    description: 'Complete low-fidelity wireframes for the new onboarding sequence including signup, profile setup, and first-run tour.',
  },
  {
    id: 't2',
    title: 'Review Q4 campaign copy',
    project: 'Q4 Marketing Launch',
    projectId: 'p2',
    status: 'review',
    priority: 'medium',
    dueDate: 'Tomorrow',
    dueDateISO: '2026-11-12',
    assignee: members.am,
    description: 'Review and approve email, social, and landing page copy for the holiday campaign.',
  },
  {
    id: 't3',
    title: 'Approve Stripe webhook integration',
    project: 'Billing System Migration',
    projectId: 'p3',
    status: 'todo',
    priority: 'urgent',
    dueDate: 'Nov 13',
    dueDateISO: '2026-11-13',
    assignee: members.am,
    description: 'Review the webhook implementation for subscription events and sign off on the security review.',
  },
  {
    id: 't4',
    title: 'Update component library docs',
    project: 'Customer Portal v2',
    projectId: 'p4',
    status: 'todo',
    priority: 'low',
    dueDate: 'Nov 15',
    dueDateISO: '2026-11-15',
    assignee: members.am,
  },
  {
    id: 't5',
    title: 'Sync with design on icon set',
    project: 'Mobile App Redesign',
    projectId: 'p1',
    status: 'done',
    priority: 'medium',
    dueDate: 'Yesterday',
    dueDateISO: '2026-11-10',
    assignee: members.am,
  },
  {
    id: 't6',
    title: 'Draft enterprise pricing tiers',
    project: 'Billing System Migration',
    projectId: 'p3',
    status: 'in-progress',
    priority: 'high',
    dueDate: 'Nov 14',
    dueDateISO: '2026-11-14',
    assignee: members.am,
  },
  {
    id: 't7',
    title: 'Set up analytics event tracking',
    project: 'Analytics Dashboard',
    projectId: 'p5',
    status: 'todo',
    priority: 'medium',
    dueDate: 'Nov 16',
    dueDateISO: '2026-11-16',
    assignee: members.jc,
  },
  {
    id: 't8',
    title: 'Create brand color palette',
    project: 'Brand Refresh 2026',
    projectId: 'p6',
    status: 'in-progress',
    priority: 'medium',
    dueDate: 'Nov 17',
    dueDateISO: '2026-11-17',
    assignee: members.sr,
  },
  {
    id: 't9',
    title: 'Write activation metric spec',
    project: 'Onboarding Flow v3',
    projectId: 'p7',
    status: 'review',
    priority: 'high',
    dueDate: 'Nov 18',
    dueDateISO: '2026-11-18',
    assignee: members.am,
  },
  {
    id: 't10',
    title: 'Implement quota middleware',
    project: 'API Rate Limiting',
    projectId: 'p8',
    status: 'done',
    priority: 'urgent',
    dueDate: 'Nov 05',
    dueDateISO: '2026-11-05',
    assignee: members.jc,
  },
  {
    id: 't11',
    title: 'Build NPS survey component',
    project: 'Customer Feedback Loop',
    projectId: 'p9',
    status: 'in-progress',
    priority: 'medium',
    dueDate: 'Nov 19',
    dueDateISO: '2026-11-19',
    assignee: members.nk,
  },
  {
    id: 't12',
    title: 'Migrate color tokens to new system',
    project: 'Design Tokens Migration',
    projectId: 'p10',
    status: 'todo',
    priority: 'high',
    dueDate: 'Nov 20',
    dueDateISO: '2026-11-20',
    assignee: members.el,
  },
  {
    id: 't13',
    title: 'QA billing flow on staging',
    project: 'Billing System Migration',
    projectId: 'p3',
    status: 'todo',
    priority: 'urgent',
    dueDate: 'Nov 21',
    dueDateISO: '2026-11-21',
    assignee: members.sr,
  },
  {
    id: 't14',
    title: 'Design empty states for dashboard',
    project: 'Analytics Dashboard',
    projectId: 'p5',
    status: 'review',
    priority: 'low',
    dueDate: 'Nov 22',
    dueDateISO: '2026-11-22',
    assignee: members.sr,
  },
  {
    id: 't15',
    title: 'Export brand guidelines PDF',
    project: 'Brand Refresh 2026',
    projectId: 'p6',
    status: 'todo',
    priority: 'low',
    dueDate: 'Nov 24',
    dueDateISO: '2026-11-24',
    assignee: members.el,
  },
  {
    id: 't16',
    title: 'Configure feedback webhook',
    project: 'Customer Feedback Loop',
    projectId: 'p9',
    status: 'done',
    priority: 'medium',
    dueDate: 'Nov 09',
    dueDateISO: '2026-11-09',
    assignee: members.jc,
  },
  {
    id: 't17',
    title: 'Accessibility audit on portal',
    project: 'Customer Portal v2',
    projectId: 'p4',
    status: 'in-progress',
    priority: 'high',
    dueDate: 'Nov 26',
    dueDateISO: '2026-11-26',
    assignee: members.nk,
  },
  {
    id: 't18',
    title: 'Sprint planning notes',
    project: 'Mobile App Redesign',
    projectId: 'p1',
    status: 'todo',
    priority: 'low',
    dueDate: 'Nov 27',
    dueDateISO: '2026-11-27',
    assignee: members.am,
  },
];

export function getProjectById(id: string): ProjectDetail | undefined {
  const project = allProjects.find((p) => p.id === id);
  if (!project) return undefined;
  const tasks = allTasks.filter((t) => t.projectId === id);
  return { ...project, tasks, activity: recentActivity };
}

export function getWorkspaceById(id: string): Workspace | undefined {
  return workspaces.find((w) => w.id === id);
}

export function getProjectsByWorkspace(workspaceName: string): Project[] {
  return allProjects.filter((p) => p.workspace === workspaceName);
}
