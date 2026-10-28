import Workspace from "../models/workspace.model.js";
import ApiError from "../utils/ApiError.js";
import Project from "../models/project.model.js";
interface CreateWorkspaceInput {
    name: string;
}

interface UpdateWorkspaceInput {
    name: string;
}

export const createWorkspace = async (
    userId: string,
    data: CreateWorkspaceInput
) => {
    const workspace = await Workspace.create({
        name: data.name,
        owner: userId,
    });
    return workspace;
}

export const getUserWorkspaces = async (userId: string) => {
    return Workspace.find({ owner: userId })
    .sort({ createdAt: -1 });
};

export const getWorkspaceById = async (
    userId: string,
    workspaceId: string
) => {
    const workspace = await Workspace.findOne({
        _id: workspaceId,
        owner: userId,
    });

    if(!workspace) {
        throw new ApiError(404, "Workspace not found");
    }
    return workspace;
};

export const updateWorkspace = async (
    userId: string,
    workspaceId: string,
    data: UpdateWorkspaceInput
) => {
    const workspace = await Workspace.findOneAndUpdate(
        {
            _id: workspaceId,
            owner: userId,
        },
        {
            $set: {
                name: data.name,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }
    return workspace;
};

export const deleteWorkspace = async (
    userId: string,
    workspaceId: string
) => {
    const workspace = await Workspace.findOne({
        _id: workspaceId,
        owner: userId,
    });

    if(!workspace) {
        throw new ApiError(404, "Workspace not found");
    }
    const hasProjects = await Project.exists({
        workspace: workspace._id,
    });
    if(hasProjects) {
        throw new ApiError(
            409,
            "Cannot delete workspace because it contains projects"
        );
    }

    await workspace.deleteOne();
    return workspace;
};