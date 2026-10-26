import type { Request, Response } from "express";
import asyncHandler from  "../utils/asyncHandler.js";
import { getCurrentUser, updateCurrentUser } from "../services/user.service.js";
import { updateProfileSchema } from "../validation/user.validation.js";
import ApiError from "../utils/ApiError.js";

export const getMe = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new Error("Authenticated user ID is missing");
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

        const data = updateProfileSchema.parse(req.body);

        const user = await updateCurrentUser(
            req.userId,
            data
        );

        res.status(200).json({
            success: true,
            message: "profile updated successfully",
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