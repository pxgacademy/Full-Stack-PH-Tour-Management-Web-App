import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import sCode from "../statusCode";
import { verifyToken } from "../utils/jwt";

export interface Req extends Request {
  user: object;
}

export const verifyJWT = (req: Req, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return next(new AppError(sCode.UNAUTHORIZED, "Unauthorized"));

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return next(new AppError(sCode.FORBIDDEN, "Invalid token"));
    req.user = decoded as object;
    next();
  } catch {
    next(new AppError(sCode.FORBIDDEN, "Invalid token"));
  }
};
