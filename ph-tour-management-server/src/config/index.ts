import dotenv from "dotenv";
dotenv.config();

export const d_config = {
  port: process.env.PORT || 5000,
  mongo_url: process.env.MONGODB_URL as string,
  node_env: process.env.NODE_ENV || "development",
};
