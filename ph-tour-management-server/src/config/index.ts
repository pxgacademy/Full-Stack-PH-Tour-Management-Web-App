import dotenv from "dotenv";
import { AppError } from "../errors/AppError";
dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGODB_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  BCRYPT_SALT_ROUND: number;
}

const allEnv = [
  "PORT",
  "MONGODB_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "BCRYPT_SALT_ROUND",
];

allEnv.forEach((e) => {
  if (!process.env[e])
    throw new AppError(500, `❌ ${e} is not defined in environment variables`);
});

export const env_config: EnvConfig = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
} as EnvConfig;
