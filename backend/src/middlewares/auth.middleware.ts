import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { th } from "zod/locales";

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

        if(!authHeader || !authHeader.startsWith("Bearer")) {
            throw new ApiError(401, "Authentication token is required");
        }

        const token = authHeader.split(" ")[1];

        if(!token) {
            throw new ApiError(401, "Authentication token is required");
        }

        const secret = process.env.JWT_SECRET;
        if(!secret) {
            throw new ApiError(500, "Authentication configuration error");
        }
        let decoded: string | JwtPayload;

        try {
            decoded = jwt.verify(token, secret);
        } catch {
            throw new ApiError(401, "Invalid or expired authentication token");
        }

        if(
            typeof decoded === "string" || typeof decoded.userId !== "string"
        ) {
            throw new ApiError(401, "Invalid authentication token");
        }
        req.userId = decoded.userId;
        next();
    }
);
export default authMiddleware;