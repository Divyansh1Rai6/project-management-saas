
import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

import {
    getMe,
    updateMe,
} from "../controllers/user.controller.js";

import { updateProfileSchema } from "../validation/user.validation.js";

const router = Router();

router.get("/me", authMiddleware, getMe);

router.patch(
    "/me",
    authMiddleware,
    validate(updateProfileSchema),
    updateMe
);

export default router;
