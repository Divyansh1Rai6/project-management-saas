
import mongoose from "mongoose";
import Project from "../models/project.model.js";
import type { PROJECT_STATUSES, ProjectStatus } from "../types/project.types.js";
import ApiError from "../utils/ApiError.js";
import Workspace from "../models/workspace.model.js";

interface CreateProjectData {
    name: string;
    description: string;
    status?: ProjectStatus;
    workspaceId: string;
}

interface UpdateProjectData {
    name?: string;
    description?: string;
    status?: (typeof PROJECT_STATUSES)[number];
}

export const createProject = async (
    data: CreateProjectData,
    userId: string
) => {
    if (!mongoose.isValidObjectId(data.workspaceId)) {
        throw new ApiError(400, "Invalid workspace ID");
    }

    const workspace = await Workspace.findOne({
        _id: data.workspaceId,
        owner: userId,
    });
    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }
    const project = await Project.create({
        name: data.name,
        description: data.description,
        status: data.status,
        owner: new mongoose.Types.ObjectId(userId),
        workspace: workspace._id,
    });

    return project;
};

export const getProjects = async (userId: string, workspaceId: string) => {
    if(!mongoose.isValidObjectId(workspaceId)) {
        throw new ApiError(400, "Invalid workspace ID");
    }

    const workspace = await Workspace.findOne({
        _id: workspaceId,
        owner: userId,
    });
    if(!workspace) {
        throw new ApiError(404, "Workspaace not found");
    }
    return Project.find({ owner: userId, workspace: workspace._id, }).sort({ createdAt: -1 });
};

export const getProjectById = async (id: string, userId: string) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findOne({ _id: id, owner: userId });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return project;
};

export const updateProject = async (
    id: string,
    data: UpdateProjectData,
    userId: string
) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findOneAndUpdate(
        { _id: id, owner: userId },

        {
            $set: data,
        },
        { new: true, runValidators: true }
    );

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return project;
};

export const deleteProject = async (id: string, userId: string) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findOneAndDelete({
        _id: id,
        owner: userId,
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return project;
};
