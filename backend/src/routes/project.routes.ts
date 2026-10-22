import {Router} from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/project.controllers.js";
import validate from "../middlewares/validation.middleware.js";
import { createProjectaSchema, updateProjectSchema } from "../validation/project.validation.js";


const router = Router();

router.post("/", validate(createProjectaSchema), createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.patch("/:id", validate(updateProjectSchema), updateProject);

router.delete("/:id", deleteProject);

export default router;