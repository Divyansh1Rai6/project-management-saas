import { z } from "zod";

export const createdWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Workspace name must be at least 2 characters")
        .max(100, "Workspace name cannot exceed 100 characters"),
}).strict();

export const updateWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Workspace name must be at least 2 characters")
        .max(100, "Workspace name cannot exceed 100 characters"),
}).strict();