import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env_config } from "../../config";

const JWT_SECRET: string = env_config.JWT_SECRET;
const JWT_REFRESH_SECRET: string = env_config.JWT_REFRESH_SECRET;

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env_config.JWT_TOKEN_PERIOD,
  } as SignOptions);
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: env_config.JWT_REFRESH_TOKEN_PERIOD,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};
