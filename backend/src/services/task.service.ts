import mongoose from "mongoose";

import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Workspace from "../models/workspace.model.js";
import ApiError from "../utils/ApiError.js";
import { StringValidation } from "zod/v3";

interface CreateTaskData {
    title: string;
    description?: string;
    status?: "Todo" | "In-progress" | "Done";
    prirority?: "Low" | "Medium" | "High" | "Urgent";
    dueDate?: string | null;
    projectId: string;
}

interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: "Todo" | "In-progress" | "Done";
    priority?: "Low" |  "Medium" | "High" | "Urgent";
    dueDate?: string | null;
}

const validateObjectId = (id: string, message: string) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, message);
    }
};

const getOwnedProject = async (projectId: string, userId: string) => {
    validateObjectId(projectId, "Invalid project ID");

    const project = await Project.findOne({
        _id: projectId,
        owner: userId,
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const workspace = await Workspace.findOne({
        _id: project.workspace,
        owner: userId,
    });

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }
    return project;
};

export const createTask = async (
    data: CreateTaskData,
    userId: string
) => {
    const project = await getOwnedProject(data.projectId, userId);

    const task = await Task.create({
        title: data.title,
        description: data.description ?? "",
        status: data.status,
        priority: data.prirority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        project: project._id,
        workspace: project.workspace,
        owner: new mongoose.Types.ObjectId(userId),
    });
    return task;
}


export const getTasks = async (
    userId: string,
    projectId: string
) => {
    const project = await getOwnedProject(projectId, userId);

    return Task.find({
        owner: userId,
        project: project._id,
        workspace: project.workspace,
    }).sort({ createdAt:  -1});
};

export const getTaskById = async (
    taskId: string,
    userId: string
) => {
    validateObjectId(taskId, "Invalid task ID");

    const task = await Task.findOne({
        _id: taskId,
        owner: userId,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const project = await getOwnedProject(
        task.project.toString(),
        userId
    );


    if (!task.workspace.equals(project.workspace)) {
        throw new ApiError(409, "Task workspace relationship is invalid");
    }
    return task;
};

export const updateTask = async (
    taskId: string,
    data: UpdateTaskData,
    userId: string
) => {
    const task = await getTaskById(taskId, userId);

    const updateData = {
        ...data,
        ...(data.dueDate !== undefined
             ? {
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
             }
             : {}
        ),
    };

    Object.assign(task, updateData);
    await task.save();

    return task;
};

export const deleteTask  = async (
    taskId: string,
    userId: string
) => {
    const task = await getTaskById(taskId, userId);

    await task.deleteOne();

    return task;
};