
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
    getCurrentUser,
    updateCurrentUser,
} from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";

export const getMe = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const user = await getCurrentUser(req.userId);

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
);

export const updateMe = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const user = await updateCurrentUser(
            req.userId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
);
