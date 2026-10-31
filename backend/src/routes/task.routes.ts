import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validation/task.validator.js";
import { createTask, getTaskById, getTasks, updateTask, deleteTask } from "../controllers/task.controller.js";
import { ro } from "zod/locales";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;