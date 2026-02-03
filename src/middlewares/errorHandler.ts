import { Request as ExRequest, Response as ExResponse, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "../errors/HttpErrors";


// Global erro-handling middleware for express
// - Catches TSOA validation errors and responds with 422 + field details.
// - Handles custom HttpError instances with their defined status code and message.
// - Handles generic JS Errors with a 500 status.
export default function(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    // TSOA validation error (invalid request)
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields, // Return wich fields failed validation
        });
    }

    // Custom HTTP Error with "HttpErrors.ts"
    // The HttpError class expects a status: number and message: string
    // instanceOf check if error have the type define in HttpError
    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err instanceof Error) {
        return res.status(500).json({
            message: err.message
        })
    }

    next(); 
};