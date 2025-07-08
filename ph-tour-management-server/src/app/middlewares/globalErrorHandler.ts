/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { env_config } from "../../config";

export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDev = env_config.node_env === "development";

  let statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";

  const errorResponse = {
    success: false,
    message,
    error: {
      name: err?.name || "Error",
      errors: err?.errors || message,
    },
    stack: isDev ? err?.stack : undefined,
  };

  // Handle specific error types
  switch (err?.name) {
    case "ValidationError":
      statusCode = 400;
      errorResponse.message = "Validation Failed";
      break;

    case "MongooseError":
      statusCode = 400;
      errorResponse.message = "Database Error";
      break;

    // Add more specific cases if needed (e.g., CastError, ZodError)
  }

  res.status(statusCode).json(errorResponse);
}

/*
export default function globalErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ne = env_config.node_env === "development";
  let statusCode = 500;
  const errRes = {
    success: false,
    message: "Internal Server Error",
    error: {
      name: "Internal Server Error",
      errors: "Error not detected",
    },
    stack: null,
  };

  if (error) {
    statusCode = error?.statusCode ?? 500;
    errRes.message = error?.message ?? "Internal Server Error";
    errRes.error.name = error?.name ?? "";
    errRes.error.errors = error?.message ?? "Internal Server Error";
    errRes.stack = ne ? error?.stack : null;

    if (error.name === "ValidationError") {
      statusCode = 400;
      errRes.message = "Validation failed";
      errRes.error.errors = error.errors;
    } else if (error.name === "MongooseError") {
      statusCode = 400;
      errRes.message = "Mongoose Error";
    }
  }

  res.status(statusCode).json(errRes);
}

*/

/*
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
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
*/
