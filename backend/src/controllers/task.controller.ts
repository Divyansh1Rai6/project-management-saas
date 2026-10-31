
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import * as taskService from "../services/task.service.js";

const getAuthenticatedUserId = (req: Request): string => {
    if (!req.userId) {
        throw new ApiError(401, "Authentication required");
    }

    return req.userId;
};

export const createTask = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);

        const task = await taskService.createTask(req.body, userId);

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    }
);

export const getTasks = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const projectId = req.query.projectId;

        if (typeof projectId !== "string" || !projectId.trim()) {
            throw new ApiError(400, "Project ID is required");
        }

        const tasks = await taskService.getTasks(userId, projectId);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    }
);

export const getTaskById = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const taskId = req.params.id;

        if (typeof taskId !== "string") {
            throw new ApiError(400, "Invalid task ID");
        }

        const task = await taskService.getTaskById(taskId, userId);

        res.status(200).json({
            success: true,
            data: task,
        });
    }
);

export const updateTask = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const taskId = req.params.id;

        if (typeof taskId !== "string") {
            throw new ApiError(400, "Invalid task ID");
        }

        const task = await taskService.updateTask(
            taskId,
            req.body,
            userId
        );

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });
    }
);

export const deleteTask = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getAuthenticatedUserId(req);
        const taskId = req.params.id;

        if (typeof taskId !== "string") {
            throw new ApiError(400, "Invalid task ID");
        }

        await taskService.deleteTask(taskId, userId);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    }
);
