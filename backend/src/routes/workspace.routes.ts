import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

import {
    create,
    getAll,
    getById,
    update,
    remove,
} from "../controllers/workspace.controller.js";

import {
    createdWorkspaceSchema,
    updateWorkspaceSchema,
} from "../validation/workspace.validator.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createdWorkspaceSchema), create);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", validate(updateWorkspaceSchema), update);
router.delete("/:id", remove);

export default router;