import { compare, hash } from "bcryptjs";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { env_config } from "../../../config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { iUser } from "../user/user.interface";
import { User } from "../user/user.model";

//
export const credentialLoginService = async (payload: Partial<iUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }).select("+password");

  if (!isUserExist) throw new AppError(sCode.NOT_FOUND, "User not found!");

  const isPasswordRight = await compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordRight)
    throw new AppError(sCode.UNAUTHORIZED, "Incorrect credentials");

  const userData = isUserExist.toObject();
  delete userData.password;
  return { data: userData };
};

//
export const resetPasswordService = async (req: Request) => {
  const { _id, email } = req.decoded as JwtPayload;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(_id).select("+password");

  const isOldPassMatch = await compare(oldPassword, user?.password as string);
  if (!isOldPassMatch)
    throw new AppError(sCode.BAD_REQUEST, "Old password does not match");

  const password = await hash(newPassword, env_config.BCRYPT_SALT_ROUND);
  await User.findByIdAndUpdate(_id, { password });

  return {
    data: { _id, email, message: "Password updated successfully" },
  };
};
