import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

const handleZodError = (res, error) => {
    return res.status(400).json({
        message: error.message,
        errors: error.issues.map((err) => ({
            path: err.path.join(","),
            message: err.message
        }))
    });
};

const handleAppError = (res, error) => {
    return res.status(error.statusCode).json({
        message: error.message
    });
};

const errorMiddleware = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);
    if (error instanceof ZodError) {
        return handleZodError(res, error);
    }
    if (error instanceof AppError) {
        return handleAppError(res, error);
    }
    return res.status(500).send("Internal server error");
};

export default errorMiddleware;