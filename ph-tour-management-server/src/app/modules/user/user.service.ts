import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { eAuthProvider, iAuthProvider, iUser } from "./user.interface";
import { User } from "./user.model";

export const createUserService = async (payload: Partial<iUser>) => {
  const { email, ...rest } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError(sCode.CONFLICT, "User Already Exist");

  const authProvider: iAuthProvider = {
    provider: "credentials" as eAuthProvider,
    providerId: email as string,
  };

  const user = await User.create({ email, auth: [authProvider], ...rest });
  return { data: user };
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
