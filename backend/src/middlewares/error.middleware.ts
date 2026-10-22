import {Request, Response, NextFunction} from "express"
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

     res.status(500).json({
        success: false,
        message: "Internal Sever Error",
     });
};

export default errorMiddleware;