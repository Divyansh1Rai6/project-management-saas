import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "Password cannot exceed 72 bytes"
    );

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

        email: z 
        .string()
        .trim()
        .email("Please provide a valid email")
        .max(254, "Email is too long")
        .transform((value) => value.toLowerCase()),

        password: passwordSchema,
}).strict();

export type  RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z
    .string()
    .trim()
    .email("Please provide a valid email")
    .max(254, "Email is too long")
    .transform((value) => value.toLowerCase()),

    password: z
    .string()
    .min(1, "Password is required")
    .refine(
        (value) => Buffer.byteLength(value, "utf8") <=72,
        "Password cannot exceed 72 bytes"
    ),
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;