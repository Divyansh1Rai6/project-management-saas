class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.statusCode = statusCode;
        this.isOperational = true;

        this.name = "ApiError";

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;    