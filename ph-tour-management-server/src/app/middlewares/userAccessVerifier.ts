import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { eIsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import sCode from "../statusCode";

export const userAccessVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.decoded)
      return next(
        new AppError(
          sCode.UNAUTHORIZED,
          "Unauthorized, probably token not found"
        )
      );

    const user = await User.findById(req.decoded._id);

    if (!user) {
      return next(new AppError(404, "User not found from user access"));
    }

    const { isDeleted, isVerified, isActive } = user;
    const blocked = eIsActive.BLOCKED;

    if (isDeleted) return next(new AppError(401, "User is deleted"));
    if (!isVerified) return next(new AppError(401, "User is not verified"));
    if (isActive === blocked) return next(new AppError(401, "User is blocked"));

    const { _id, name, email, phone, picture, address, auth, role } = user;

    req.decoded = { _id, name, email, phone, picture, address, auth, role };

    next();
  } catch (error) {
    next(error);
  }
};
