import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { eIsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const userAccessVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req?.decoded?._id).select("+password");

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    if (
      user?.isDeleted ||
      !user?.isVerified ||
      user?.isActive === eIsActive.BLOCKED
    ) {
      return next(
        new AppError(400, "User has no permission to take this action")
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
