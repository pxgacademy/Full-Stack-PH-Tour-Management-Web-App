import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";
import { verifyToken } from "../utils/jwt";

export const roleVerifier =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    try {
      if (!token)
        return next(new AppError(sCode.FORBIDDEN, "Token did not arrive"));
      const decoded = verifyToken(token);

      if (!roles.includes(decoded.role))
        return next(new AppError(sCode.FORBIDDEN, "Forbidden User Role"));

      req.decoded = decoded as JwtPayload;
      next();
    } catch {
      next(new AppError(sCode.UNAUTHORIZED, "Invalid token"));
    }
  };
