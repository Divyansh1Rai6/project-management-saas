import { z } from "zod";
import { PROJECT_STATUSES } from "../types/project.types.js";
export const createProjectaSchema = z.object({
    name: z.string().trim().min(1, "Project name is required"),

    description: z
    .string()
    .trim()
    .min(1, "Project description are required"),

    status: z
    .enum(["Planning", "In Progress", "Completed"])
    .optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, "Project name cannot be empty").optional(),
    description: z.string().trim().min(1, "Project description cannot be empty").optional(),
    status: z.enum(PROJECT_STATUSES).optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required for upadate",
    }
);  