import { iUser } from "./user.interface";
import { User } from "./user.model";

export const createUserService = async (payload: Partial<iUser>) => {
  const { name, email } = payload;
  return await User.create({ name, email });
};
