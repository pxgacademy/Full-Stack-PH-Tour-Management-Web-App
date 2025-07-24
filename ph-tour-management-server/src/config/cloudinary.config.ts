import { v2 } from "cloudinary";
import { env_config } from ".";
import sCode from "../app/statusCode";
import { extractPublicIdFromUrl } from "../app/utils/extractPublicIdFromUrl";
import { AppError } from "../errors/AppError";

const CLOUDINARY = env_config.CLOUDINARY;

v2.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const deleteImageFromCloud = async (url: string) => {
  const publicId = extractPublicIdFromUrl(url);
  try {
    if (publicId) await v2.uploader.destroy(publicId);
  } catch {
    throw new AppError(sCode.BAD_REQUEST, "Cloudinary image deletion failed");
  }
};

export const cloudinary = v2;

// v2.uploader.upload()
