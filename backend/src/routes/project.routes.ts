import {Router} from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/project.controllers.js";
import validate from "../middlewares/validation.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validation/project.validation.js";
import  authMiddleware  from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createProjectSchema), createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.patch("/:id", validate(updateProjectSchema), updateProject);

router.delete("/:id", deleteProject);

export default router;