import dotenv from "dotenv";
import { AppError } from "../errors/AppError";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_TOKEN_PERIOD: string;
  JWT_REFRESH_TOKEN_PERIOD: string;
  BCRYPT_SALT_ROUND: number;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
}

export const env_config: EnvConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_TOKEN_PERIOD: process.env.JWT_TOKEN_PERIOD,
  JWT_REFRESH_TOKEN_PERIOD: process.env.JWT_REFRESH_TOKEN_PERIOD,
  BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
} as EnvConfig;

Object.keys(env_config).forEach((e) => {
  if (!process.env[e] && e !== "NODE_ENV")
    throw new AppError(500, `❌ ${e} is not defined in environment variables`);
});
