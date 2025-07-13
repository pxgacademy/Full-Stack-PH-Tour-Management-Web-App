import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";
import { verifyToken } from "../utils/jwt";

export const tokenVerifier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(sCode.UNAUTHORIZED, "Unauthorized"));
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token)
      return next(new AppError(sCode.FORBIDDEN, "Token did not arrive"));
    const decoded = verifyToken(token);

    req.decoded = decoded as JwtPayload;
    next();
  } catch {
    next(new AppError(sCode.FORBIDDEN, "Invalid token"));
  }
};
