export const TASK_STATUSES = [
    "Todo",
    "In-progress",
    "Done",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = [
    "Low", "Medium", "High", "Urgent",
] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];