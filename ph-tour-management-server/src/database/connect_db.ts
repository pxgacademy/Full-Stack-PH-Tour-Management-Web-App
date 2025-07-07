/* eslint-disable no-console */
import mongoose from "mongoose";
import { env_config } from "../config";

export const connect_db = async (): Promise<void> => {
  let connected = false;
  let retries = 3;
  let errors;

  while (!connected && retries > 0) {
    try {
      await mongoose.connect(env_config.mongo_url as string);
      console.log("✅ MongoDB Connected");
      connected = true;
    } catch (error) {
      errors = error;
      console.error("❌ MongoDB connection failed. Retrying...");
      retries--;
      await new Promise((res) => setTimeout(res, 3000)); // wait 3s
    }
  }

  if (!connected) {
    console.error("❌ MongoDB failed to connect after retries.", errors);
    process.exit(1);
  }
};
