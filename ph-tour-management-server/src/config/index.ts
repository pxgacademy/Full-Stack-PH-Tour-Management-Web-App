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
  SSL: {
    SSL_STORE_ID: string;
    SSL_STORE_PASS: string;
    SSL_PAYMENT_API: string;
    SSL_VALIDATION_API: string;
    SSL_SUCCESS_SERVER_URL: string;
    SSL_FAIL_SERVER_URL: string;
    SSL_CANCEL_SERVER_URL: string;
    SSL_SUCCESS_CLIENT_URL: string;
    SSL_FAIL_CLIENT_URL: string;
    SSL_CANCEL_CLIENT_URL: string;
  };
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
  SSL: {
    SSL_STORE_ID: process.env.SSL_STORE_ID,
    SSL_STORE_PASS: process.env.SSL_STORE_PASS,
    SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
    SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
    SSL_SUCCESS_SERVER_URL: process.env.SSL_SUCCESS_SERVER_URL,
    SSL_FAIL_SERVER_URL: process.env.SSL_FAIL_SERVER_URL,
    SSL_CANCEL_SERVER_URL: process.env.SSL_CANCEL_SERVER_URL,
    SSL_SUCCESS_CLIENT_URL: process.env.SSL_SUCCESS_CLIENT_URL,
    SSL_FAIL_CLIENT_URL: process.env.SSL_FAIL_CLIENT_URL,
    SSL_CANCEL_CLIENT_URL: process.env.SSL_CANCEL_CLIENT_URL,
  },
} as EnvConfig;

Object.keys(env_config).forEach((e) => {
  if (!process.env[e] && e !== "NODE_ENV" && e !== "SSL")
    throw new AppError(500, `❌ ${e} is not defined in environment variables`);
});

Object.keys(env_config.SSL).forEach((e) => {
  if (!process.env[e])
    throw new AppError(500, `❌ ${e} is not defined in environment variables`);
});

export const isDev = env_config?.NODE_ENV === "development";
