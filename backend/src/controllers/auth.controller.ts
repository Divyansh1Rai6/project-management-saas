import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js"
import type { LoginInput } from "../validation/auth.validator.js";
import { success } from "zod";

export const register = asyncHandler(
    async (req: Request, res: Response) => {
        const user = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    }
);

export const login = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login Successfull",
            data: result,
        });
    }
);