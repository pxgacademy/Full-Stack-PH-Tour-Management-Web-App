import dotenv from "dotenv";
import { AppError } from "../errors/AppError";
dotenv.config();

interface EnvConfig {
  port: string;
  mongo_url: string;
  node_env: string;
  jwt_secret: string;
  jwt_refresh_secret: string;
}

const allEnv = ["PORT", "MONGODB_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];

allEnv.forEach((e) => {
  if (!process.env[e])
    throw new AppError(500, `❌ ${e} is not defined in environment variables`);
});

export const env_config: EnvConfig = {
  port: process.env.PORT,
  mongo_url: process.env.MONGODB_URL,
  node_env: process.env.NODE_ENV || "development",
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
} as EnvConfig;
