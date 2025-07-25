import { compare, hash } from "bcryptjs";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { env_config } from "../../../config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { eAuthProvider, iUser } from "../user/user.interface";
import { User } from "../user/user.model";

//
export const credentialLoginService = async (payload: Partial<iUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }).select("+password");
  if (!isUserExist) throw new AppError(sCode.NOT_FOUND, "User not found!");

  let isPasswordMatch = false;
  if (isUserExist?.password) {
    isPasswordMatch = await compare(
      password as string,
      isUserExist?.password as string
    );
  }

  if (!isPasswordMatch) {
    throw new AppError(sCode.UNAUTHORIZED, "Incorrect credentials");
  }

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

//
export const changePasswordService = async (req: Request) => {
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

//
export const setPasswordService = async (req: Request) => {
  const { _id, email } = req.decoded as JwtPayload;
  const { password } = req.body;

  const user = await User.findById(_id).select("+password +auth");
  if (!user) throw new AppError(sCode.NOT_FOUND, "User not found");

  if (user.password) {
    throw new AppError(
      sCode.BAD_REQUEST,
      "You already have a password, try to login or forgot password"
    );
  }

  user.auth = [
    {
      provider: eAuthProvider.credentials,
      providerId: email,
    },
    ...user.auth,
  ];

  user.password = await hash(password, env_config.BCRYPT_SALT_ROUND);

  await user.save();

  return {
    data: { _id, email, message: "Password created successfully" },
  };
};
