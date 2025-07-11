import dotenv from "dotenv";
import { AppError } from "../errors/AppError";
dotenv.config();

interface EnvConfig {
  port: string;
  mongo_url: string;
  node_env: string;
}

const allEnv = ["PORT", "MONGODB_URL"];

allEnv.forEach((e) => {
  if (!process.env[e])
    throw new AppError(500, `❌ your "${e}" env is not defined`);
});

export const env_config: EnvConfig = {
  port: process.env.PORT || "5000",
  mongo_url: process.env.MONGODB_URL as string,
  node_env: process.env.NODE_ENV || "development",
};
