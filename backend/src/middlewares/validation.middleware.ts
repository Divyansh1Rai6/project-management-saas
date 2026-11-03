import type { Request, Response, NextFunction } from "express";
import { z } from "zod"

const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if(!result.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
            return;
        }
        req.body = result.data;

        next(); 
    }
}

export default validate;