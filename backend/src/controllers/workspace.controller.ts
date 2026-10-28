import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { createWorkspace, getUserWorkspaces, getWorkspaceById, updateWorkspace, deleteWorkspace } from "../services/workspace.service.js";

import { createdWorkspaceSchema, updateWorkspaceSchema } from "../validation/workspace.validator.js";
import Workspace from "../models/workspace.model.js";

export const create = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const data = createdWorkspaceSchema.parse(req.body);

        const workspace = await createWorkspace(req.userId, data);

        res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            data: workspace,
        });
    }
);

export const getAll = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const workspaces = await getUserWorkspaces(req.userId);

        res.status(200).json({
            success: true,
            count: workspaces.length,
            data: workspaces,
        });
    }
);

export const getById = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const workspaceId = req.params.id;
        if(typeof workspaceId !== "string") {
            throw new ApiError(400, "Invalid workspace ID");
        }
        const workspace = await getWorkspaceById(
            req.userId,
            workspaceId
        );

        res.status(200).json({
            success: true,
            data: workspace,
        });
    }
);

export const update = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const data = updateWorkspaceSchema.parse(req.body);

        const workspaceId = req.params.id;
        if(typeof workspaceId !== "string") {
            throw new ApiError(400, "Invalid workspace ID");
        }
        const workspace = await updateWorkspace(
            req.userId,
            workspaceId,
            data
        );
        res.status(200).json({
            success: true,
            message: "Workspace updated successfully",
            data: workspace,
        });
    }
);

export const remove = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.userId) {
            throw new ApiError(401, "Authentication required");
        }

        const workspaceId = req.params.id;
        if(typeof workspaceId !== "string") {
            throw new ApiError(400, "Invalid workspace ID");
        }
        await deleteWorkspace(req.userId, workspaceId);

        res.status(200).json({
            success: true,
            message: "Workspace deleted successfully",
        });
    }
);