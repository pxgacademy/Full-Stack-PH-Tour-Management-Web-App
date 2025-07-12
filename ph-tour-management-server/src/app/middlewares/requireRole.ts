import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";

interface Req extends Request {
  user: {
    role: string;
  };
}

export const requireRole = (...roles: string[]) => {
  return (req: Req, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError(sCode.FORBIDDEN, "Forbidden"));
    }
    next();
  };
};
