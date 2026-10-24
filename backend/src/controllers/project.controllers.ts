
import type { Request, Response } from "express";
import * as projectService from "../services/project.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";  

const getAuthenticatedUserId = (req: Request): string => {
  if(!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  return req.userId;
};

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await projectService.createProject(req.body, getAuthenticatedUserId(req));

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  }
);

export const getProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const projects = await projectService.getProjects(getAuthenticatedUserId(req));

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  }
);

export const getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new ApiError(400, "Invalid project ID");
    }

    const project = await projectService.getProjectById(id, getAuthenticatedUserId(req));

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new ApiError(400, "Invalid project ID");
    }

    const project = await projectService.updateProject(id, req.body, getAuthenticatedUserId(req));

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  }
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new ApiError(400, "Invalid project ID");
    }

    await projectService.deleteProject(id, getAuthenticatedUserId(req));

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  }
);
