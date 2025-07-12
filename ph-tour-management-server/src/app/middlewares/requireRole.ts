import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";
import { verifyToken } from "../utils/jwt";

export const requireRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return next(new AppError(sCode.UNAUTHORIZED, "Unauthorized"));

    try {
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token) as JwtPayload;
      if (!decoded) return next(new AppError(sCode.FORBIDDEN, "Invalid token"));

      if (!roles.includes(decoded.role)) {
        return next(new AppError(sCode.FORBIDDEN, "Forbidden User Role"));
      }
      // TODO:
      // req.user = decoded
      next();
    } catch (error) {
      next(error);
    }
  };
