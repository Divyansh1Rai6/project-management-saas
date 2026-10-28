
import { z } from "zod";
import { PROJECT_STATUSES } from "../types/project.types.js";

export const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Project name is required")
        .max(100, "Project name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .min(1, "Project description is required")
        .max(2000, "Project description cannot exceed 2000 characters"),

    status: z.enum(PROJECT_STATUSES).optional(),

    workspaceId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid workspace ID"),
}).strict();

export const updateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Project name cannot be empty")
        .max(100, "Project name cannot exceed 100 characters")
        .optional(),

    description: z
        .string()
        .trim()
        .min(1, "Project description cannot be empty")
        .max(2000, "Project description cannot exceed 2000 characters")
        .optional(),

    status: z.enum(PROJECT_STATUSES).optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required for update",
    }
);
