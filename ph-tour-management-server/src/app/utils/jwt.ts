import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import { env_config } from "../../config";

const JWT_SECRET: string = env_config.jwt_secret;
const JWT_REFRESH_SECRET: string = env_config.jwt_refresh_secret;

export const generateToken = (
  payload: object,
  expiresIn: StringValue
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (
  payload: object,
  expiresIn: StringValue
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
