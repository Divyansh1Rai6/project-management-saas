export const PROJECT_STATUSES = [
    "Planning",
    "In-progress",
    "Completed",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES) [number];