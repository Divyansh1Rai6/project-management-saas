import Project from "../models/project.model.js";
import type { PROJECT_STATUSES, ProjectStatus } from "../types/project.types.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js"
interface CreateProjectData {
    name: string;
    description: string;
    status? : ProjectStatus;
}

export const getProjectById = async (id: string) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(id);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    return project;
}

export const createProject = async (data: CreateProjectData) => {
    const project = await Project.create(data);
    return project;
};

export const getProjects = async () => {
    const projects = await Project.find().sort({ createdAt : -1 })
    return projects;
};

interface UpdateProjectData {
    name?: string;
    description?: string;
    status?: (typeof PROJECT_STATUSES)[number];
}

export const updateProject = async (
    id: string,
    data: UpdateProjectData
) => {
    if(!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Inavlid project ID");
    }

    const project = await Project.findByIdAndUpdate(
        id, 
        data,
        {
            new: true,
            runValidators: true,
        }
    );
    if(!project) {
        throw new ApiError(404, "Project not found");
    }
    return project;
};

export const deleteProject = async (id: string) => {
    
    if (!mongoose.isValidObjectId(id)) 
        throw new ApiError(400, "Invalid project ID");

    const project = await Project.findByIdAndDelete(id);

    if (!project)
        throw new ApiError(404, "Project not found");

    return project;
};