/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { isDev } from "../../config";
import { deleteImageFromCloud } from "../../config/cloudinary/deleteImageFromCloud";
import {
  appError,
  castError,
  mongooseError,
  validationError,
  zodValidationError,
} from "../../errors";
import { AppError } from "../../errors/AppError";

//
export default async function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errCode = err?.code || err?.cause?.code || null;
  const message = err?.message || "Internal Server Error";

  const response = {
    statusCode: err?.statusCode || 500,
    success: false,
    message,
    error: [
      { name: err?.name || "Error" },
      { path: err?.path, message: err?.errors || message },
    ],
    stack: isDev ? err?.stack : undefined,
  };

  if (err instanceof AppError) response.error = appError(err);

  switch (err?.name) {
    case "ValidationError":
      response.statusCode = 400;
      response.message = "Validation Failed";
      response.error = validationError(err);
      break;

    case "MongooseError":
      response.statusCode = errCode ? 409 : 400;
      response.message = "Database Error";
      response.error = mongooseError(err);
      break;

    case "CastError":
      response.statusCode = 400;
      response.message = "Invalid ID Format";
      response.error = castError(err);
      break;

    case "ZodError":
      response.statusCode = 400;
      response.message = "Zod Validation Error";
      response.error = zodValidationError(err);
      break;
  }

  if (req.file && req.file.path) await deleteImageFromCloud(req.file.path);

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files?.map((file) => file.path);

    await Promise.all(imageUrls.map((url) => deleteImageFromCloud(url)));
  }

  //
  res.status(response.statusCode).json(response);
}

/*
export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDev = env_config.NODE_ENV === "development";
  const errCode = err?.code || err?.cause?.code || null;
  const email = err?.keyValue?.email || err?.cause?.keyValue?.email || null; // conflict email

  const message = err?.message || "Internal Server Error";

  const response = {
    statusCode: err?.statusCode || 500,
    success: false,
    message,
    error: {
      name: err?.name || "Error",
      errors: err?.errors || { message },
    },
    stack: isDev ? err?.stack : undefined,
  };

  const knownClientErrors = [
    { name: "ValidationError", message: "Validation Failed" },
    { name: "MongooseError", message: "Database Error" },
    { name: "CastError", message: "Invalid ID Format" },
    { name: "ZodError", message: "Zod Validation Error" },
  ];

  knownClientErrors.forEach(({ name, message }) => {
    if (err?.name === name) {
      if (errCode === 11000) {
        response.statusCode = 409;
        response.message = email ? `${email} already exist` : message;
      } else {
        response.statusCode = 400;
        response.message = message;
      }
    }
  });

  res.status(response.statusCode).json(response);
}
*/

// console.log("Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

/*
export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDev = env_config.NODE_ENV === "development";

  let statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";

  const errorResponse = {
    statusCode,
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

    case "CastError":
      statusCode = 400;
      errorResponse.message = "Invalid ID Format";
      break;

    case "ZodError":
      statusCode = 400;
      errorResponse.message = "Zod Validation Error";
      break;
  }

  res.status(statusCode).json(errorResponse);
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
