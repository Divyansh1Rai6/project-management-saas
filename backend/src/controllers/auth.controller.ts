import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js"
import { refreshAccessToken } from "../services/auth.service.js";
import { logoutUser } from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";

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

export const logout = asyncHandler(
    async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer")) {
        throw new ApiError(401, "Authentication token is required");
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
        throw new ApiError(401, "Authentication token is required");
    }

    const refreshToken = req.body?.refreshToken;

    if(
        typeof refreshToken !== "string" || !refreshToken.trim()
    ) {
        throw new ApiError(400, "Refresh token is required");
    }

    const result = await logoutUser(token, refreshToken);
     
    res.status(200).json({
        success: true,
        message: result.message,
    });
}
);


export const refresh = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken = req.body?.refreshToken;

        if(
            typeof refreshToken !== "string" || !refreshToken.trim()
        ) {
            throw new ApiError(401, "Refresh token is required");
        }
        const result = await refreshAccessToken(refreshToken);

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: result,
        });
    }
);

