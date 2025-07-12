import { hash } from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { env_config } from "../../../config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import {
  eAuthProvider,
  eIsActive,
  eUserRoles,
  iAuthProvider,
  iUser,
} from "./user.interface";
import { User } from "./user.model";

export const createUserService = async (payload: Partial<iUser>) => {
  const { email, password, ...rest } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError(sCode.CONFLICT, "User Already Exist");

  const hashedPassword = await hash(
    password as string,
    env_config.BCRYPT_SALT_ROUND
  );
  if (!hashedPassword)
    throw new AppError(
      sCode.UNPROCESSABLE_ENTITY,
      "Password could not be processed by bcrypt"
    );

  const authProvider: iAuthProvider = {
    provider: "credentials" as eAuthProvider,
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auth: [authProvider],
    ...rest,
  });
  return { data: user };
};

export const updateUserService = async (
  userId: string | Types.ObjectId,
  payload: Partial<iUser>,
  decoded: JwtPayload
) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(sCode.NOT_FOUND, "User Not Found");
  }

  if (
    decoded.role === eUserRoles.USER ||
    decoded.role === eUserRoles.MODERATOR
  ) {
    if (isUserExist.isActive === eIsActive.BLOCKED || isUserExist.isDeleted) {
      throw new AppError(
        sCode.FORBIDDEN,
        "This user cannot be updated without admin super admin"
      );
    }
  }

  if (payload.role && decoded.role !== eUserRoles.SUPER_ADMIN) {
    throw new AppError(sCode.FORBIDDEN, "Forbidden User Role");
  }

  if (
    (payload.isActive || payload.isDeleted || payload.isVerified) &&
    (decoded.role === eUserRoles.USER || decoded.role === eUserRoles.MODERATOR)
  ) {
    throw new AppError(sCode.FORBIDDEN, "Forbidden User Role");
  }

  if (payload.password) {
    payload.password = await hash(
      payload.password,
      env_config.BCRYPT_SALT_ROUND
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return {
    data: updatedUser,
  };
};

export const getAllUsersService = async () => {
  const users = await User.find();
  const totalUser = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};
