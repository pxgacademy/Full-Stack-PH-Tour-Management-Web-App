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

  // const existingUser = await User.findOne({ email });
  // if (existingUser) throw new AppError(sCode.CONFLICT, "User Already Exist");

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
  const presentData = await User.findById(userId);
  if (!presentData) {
    throw new AppError(sCode.NOT_FOUND, "User Not Found");
  }

  //* payload      : What user wants to change
  //* presentData  : user's present data
  //* decoded      : The data of the user who wants to change

  const { role } = decoded;
  const { MODERATOR, SUPER_ADMIN, USER } = eUserRoles;

  if (payload.role && role !== SUPER_ADMIN) {
    throw new AppError(sCode.FORBIDDEN, "Forbidden User Role");
  }

  if (role === USER || role === MODERATOR) {
    if (presentData.isActive === eIsActive.BLOCKED || presentData.isDeleted) {
      throw new AppError(
        sCode.FORBIDDEN,
        "This user cannot be updated without admin or super admin"
      );
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
      throw new AppError(sCode.FORBIDDEN, "Forbidden User Role");
    }
  }

  if (payload.password) delete payload.password;

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
