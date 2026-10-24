
import mongoose from "mongoose";
import Project from "../models/project.model.js";
import type { PROJECT_STATUSES, ProjectStatus } from "../types/project.types.js";
import ApiError from "../utils/ApiError.js";

interface CreateProjectData {
    name: string;
    description: string;
    status?: ProjectStatus;
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
    const project = await Project.create({
        ...data,
        owner: new mongoose.Types.ObjectId(userId),
    });

    return project;
};

export const getProjects = async (userId: string) => {
    return Project.find({ owner: userId }).sort({ createdAt: -1 });
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
        data,
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
