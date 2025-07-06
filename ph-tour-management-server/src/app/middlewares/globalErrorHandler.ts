import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../../errors/AppError";
import { handleValidationError } from "../../errors/handleValidationError";
import { handleCastError } from "../../errors/handleCastError";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errors: { path: string | number; message: string }[] = [];

  // Zod validation error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Zod Validation Error";
    errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const simplified = handleValidationError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errors = simplified.errorMessages;
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  else if (err.name === "CastError") {
    const simplified = handleCastError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errors = simplified.errorMessages;
  }

  // Custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = [{ path: "", message: err.message }];
  }

  // Fallback (unknown)
  else if (err instanceof Error) {
    message = err.message;
    errors = [{ path: "", message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
