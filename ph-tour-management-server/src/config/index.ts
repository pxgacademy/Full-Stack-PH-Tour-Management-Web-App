import dotenv from "dotenv";
dotenv.config();

type EnvValue = string | EnvRecord;
interface EnvRecord {
  [key: string]: EnvValue;
}

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
    STORE_ID: string;
    STORE_PASS: string;
    PAYMENT_API: string;
    VALIDATION_API: string;
    SUCCESS_SERVER_URL: string;
    FAIL_SERVER_URL: string;
    CANCEL_SERVER_URL: string;
    SUCCESS_CLIENT_URL: string;
    FAIL_CLIENT_URL: string;
    CANCEL_CLIENT_URL: string;
  };
  CLOUDINARY: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
  NODEMAILER: {
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_FROM: string;
    SMTP_PASS: string;
  };
}

export const env_config: EnvConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
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
    STORE_ID: process.env.STORE_ID,
    STORE_PASS: process.env.STORE_PASS,
    PAYMENT_API: process.env.PAYMENT_API,
    VALIDATION_API: process.env.VALIDATION_API,
    SUCCESS_SERVER_URL: process.env.SUCCESS_SERVER_URL,
    FAIL_SERVER_URL: process.env.FAIL_SERVER_URL,
    CANCEL_SERVER_URL: process.env.CANCEL_SERVER_URL,
    SUCCESS_CLIENT_URL: process.env.SUCCESS_CLIENT_URL,
    FAIL_CLIENT_URL: process.env.FAIL_CLIENT_URL,
    CANCEL_CLIENT_URL: process.env.CANCEL_CLIENT_URL,
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
  },
  NODEMAILER: {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_PASS: process.env.SMTP_PASS,
  },
} as EnvConfig;

//

const envValidator = <T extends Record<string, string | EnvRecord>>(
  obj: T,
  options?: { parentKey?: string }
): void => {
  const keys = Object.keys(obj) as (keyof T)[];
  keys.forEach((key) => {
    const value = obj[key];

    const isObject = typeof value === "object" && value !== null;

    if (isObject) {
      envValidator(value, {
        parentKey: `${options?.parentKey || ""}${String(key)}.`,
      });
    } else if (!process.env[String(key)]) {
      throw new Error(
        `❌ ${
          options?.parentKey ? options.parentKey + String(key) : String(key)
        } is not defined in environment variables`
      );
    }
  });
};

envValidator(env_config as unknown as Record<string, string | EnvRecord>);

export const isDev = env_config.NODE_ENV === "development";

/*



















const envConfigKeys = Object.keys(env_config) as (keyof EnvConfig)[];
const sslKeys = Object.keys(env_config.SSL) as (keyof EnvConfig["SSL"])[];
const cloudinaryKeys = Object.keys(
  env_config.SSL
) as (keyof EnvConfig["SSL"])[];

envConfigKeys.forEach((key) => {
  if (
    !process.env[key] &&
    key !== "NODE_ENV" &&
    typeof env_config[key] !== "object"
  ) {
    throw new AppError(
      500,
      `❌ ${key} is not defined in environment variables`
    );
  }
});

sslKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new AppError(
      500,
      `❌ ${key} is not defined in environment variables`
    );
  }
});

cloudinaryKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new AppError(
      500,
      `❌ ${key} is not defined in environment variables`
    );
  }
});


*/
