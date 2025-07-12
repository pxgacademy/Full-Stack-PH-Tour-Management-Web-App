import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env_config } from "../../config";

const JWT_SECRET: string = env_config.JWT_SECRET;
const JWT_REFRESH_SECRET: string = env_config.JWT_REFRESH_SECRET;

export const generateToken = (payload: object, expiresIn: string): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
};

export const generateRefreshToken = (
  payload: object,
  expiresIn: string
): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};
