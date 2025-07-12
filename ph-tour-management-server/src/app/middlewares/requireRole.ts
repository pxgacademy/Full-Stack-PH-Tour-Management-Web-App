import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";

export const requireRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!roles.includes(req.decoded?.role)) {
        return next(new AppError(sCode.FORBIDDEN, "Forbidden User Role"));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
