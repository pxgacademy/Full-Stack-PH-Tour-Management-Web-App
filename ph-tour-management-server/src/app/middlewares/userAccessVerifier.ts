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
      const deleted = user?.isDeleted ? "deleted" : "";
      const verified = user?.isVerified ? "" : "not verified";
      const blocked = user?.isActive === eIsActive.BLOCKED ? "blocked" : "";

      return next(
        new AppError(
          400,
          `User is ${deleted}${verified && ", "}${verified}${blocked && ", "}${blocked}`
        )
      );
    }

    const { _id, name, email, phone, picture, address, auth, role } = user;

    req.decoded = { _id, name, email, phone, picture, address, auth, role };

    next();
  } catch (error) {
    next(error);
  }
};
