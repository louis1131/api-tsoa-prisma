import { Request as ExRequest, Response as ExResponse, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "../errors/HttpErrors";

export default function(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
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