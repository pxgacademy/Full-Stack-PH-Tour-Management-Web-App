import { hash } from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { env_config } from "../../../config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { checkMongoId } from "../../utils/checkMongoId";
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

  const newUser = user.toObject();
  delete newUser.password;

  return { data: newUser };
};

export const updateUserService = async (
  userId: string,
  payload: Partial<iUser>,
  decoded: JwtPayload
) => {
  const { _id: requesterId, role } = decoded;
  const { SUPER_ADMIN, ADMIN, USER, MODERATOR } = eUserRoles;

  const isSelf = requesterId === String(userId);
  const isAdmin = role === ADMIN;
  const isSuperAdmin = role === SUPER_ADMIN;

  const user = await User.findById(checkMongoId(userId));
  if (!user) {
    throw new AppError(sCode.NOT_FOUND, "User not found");
  }

  // 1. Only Self, Admin, SuperAdmin can update
  if (!isSelf && !isAdmin && !isSuperAdmin) {
    throw new AppError(
      sCode.UNAUTHORIZED,
      "You're not authorized to update this user"
    );
  }

  // 2. Role can't be changed unless Super Admin
  if ("role" in payload && !isSuperAdmin) {
    throw new AppError(sCode.FORBIDDEN, "Only Super Admin can change roles");
  }

  // 3. Blocked/Deleted users can't be updated by USER/MODERATOR
  if (
    (role === USER || role === MODERATOR) &&
    (user.isDeleted || user.isActive === eIsActive.BLOCKED)
  ) {
    throw new AppError(
      sCode.FORBIDDEN,
      "You cannot update this user. Contact admin."
    );
  }

  // 4. Enforce field-level restriction for USER & MODERATOR
  const forbiddenFields = ["isActive", "isDeleted", "isVerified"];
  if (role === USER || role === MODERATOR) {
    const hasForbiddenField = forbiddenFields.some((field) => field in payload);
    if (hasForbiddenField) {
      throw new AppError(
        sCode.FORBIDDEN,
        "You're not allowed to update these fields: isActive, isDeleted, isVerified"
      );
    }
  }

  // 5. Prevent password update here
  if ("password" in payload) {
    delete payload.password;
  }

  // 6. Proceed to update
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return { data: updatedUser };
};

export const getAllUsersService = async () => {
  const users = await User.find();
  const totalUser = await User.countDocuments();
  return {
    data: users,
    meta: { total_data: totalUser },
  };
};

//
export const getMeService = async (id: Types.ObjectId) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(sCode.NOT_FOUND, "User not found");

  return {
    data: user,
  };
};
