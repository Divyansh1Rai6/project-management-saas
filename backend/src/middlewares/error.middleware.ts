import type {Request, Response, NextFunction} from "express"
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js"

const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if(error instanceof ApiError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        })
        return;
    }

    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
        res.status(409).json({
            success: false,
            message: "A record with this value already exists",
        });
        return;
    }

    if (error instanceof mongoose.Error.CastError) {
        res.status(400).json({
            success: false,
            message: "Invalid resource ID",
        })
        return;
    }

     res.status(500).json({
        success: false,
        message: "Internal Sever Error",
     });
};

export default errorMiddleware;