import { Router } from "express";
import { register, login, logout, refresh } from "../controllers/auth.controller.js";
import  validate  from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../validation/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/logout", authMiddleware, logout);

router.post("/refresh", refresh);

export default router;