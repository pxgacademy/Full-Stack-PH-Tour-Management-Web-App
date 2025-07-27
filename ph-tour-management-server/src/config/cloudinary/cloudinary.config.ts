import { v2 } from "cloudinary";
import { env_config } from "..";

const CLOUDINARY = env_config.CLOUDINARY;

v2.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const cloudinary = v2;
