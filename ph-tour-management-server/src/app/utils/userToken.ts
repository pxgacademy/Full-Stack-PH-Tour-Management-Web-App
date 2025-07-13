import { iUserResponse } from "../modules/user/user.interface";
import { generateRefreshToken, generateToken } from "./jwt";

export const createUserToken = (user: Partial<iUserResponse>) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};
