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
  const token = req.cookies.accessToken;

  try {
    if (!token)
      return next(new AppError(sCode.UNAUTHORIZED, "Token did not arrive"));
    const decoded = verifyToken(token);

    req.decoded = decoded as JwtPayload;
    next();
  } catch {
    next(new AppError(sCode.UNAUTHORIZED, "Invalid token"));
  }
};
