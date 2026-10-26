
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "node:crypto";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import RevokedToken from "../models/revoked-token.model.js";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const authMiddleware = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw new ApiError(
                401,
                "Authentication token is required"
            );
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            throw new ApiError(
                401,
                "Authentication token is required"
            );
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new ApiError(
                500,
                "Authentication configuration error"
            );
        }

        let decoded: string | JwtPayload;

        try {
            decoded = jwt.verify(token, secret);
        } catch {
            throw new ApiError(
                401,
                "Invalid or expired authentication token"
            );
        }

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string"
        ) {
            throw new ApiError(
                401,
                "Invalid authentication token"
            );
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const isRevoked = await RevokedToken.exists({
            tokenHash,
        });

        if (isRevoked) {
            throw new ApiError(
                401,
                "Authentication token has been revoked"
            );
        }

        req.userId = decoded.userId;

        next();
    }
);

export default authMiddleware;
