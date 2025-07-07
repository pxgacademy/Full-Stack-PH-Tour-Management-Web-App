import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  port: string;
  mongo_url: string;
  node_env: string;
}

export const env_config: EnvConfig = {
  port: process.env.PORT || "5000",
  mongo_url: process.env.MONGODB_URL as string,
  node_env: process.env.NODE_ENV || "development",
};

/*
const checkUndefined = () => {
  const allEnv = ["PORT", "MONGODB_URL", "NODE_ENV"];

  allEnv.forEach((e) => {
    if (!process.env[e]) throw new Error(`Error for undefined env: ${e}`);
  });

  return {
    port: process.env.PORT || "5000",
    mongo_url: process.env.MONGODB_URL as string,
    node_env: process.env.NODE_ENV || "development",
  };
};

export const env_config = checkUndefined()
*/
