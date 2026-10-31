import  { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../types/task.types.js";

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createTaskSchema = z.object({
    title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(150, "Task title cannot exceed 150 characters"),

    description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

    status: z.enum(TASK_STATUSES).optional(),

    priority: z.enum(TASK_PRIORITIES).optional(),

    dueDate: z
    .iso
    .datetime({ offset: true })
    .optional()
    .nullable(),

    projectId: objectIdSchema, 
}).strict();

export const updateTaskSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Task title cannot be empty")
            .max(150, "Task title cannot exceed 150 characters")
            .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });