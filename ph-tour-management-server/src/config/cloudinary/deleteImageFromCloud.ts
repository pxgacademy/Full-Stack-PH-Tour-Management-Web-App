import sCode from "../../app/statusCode";
import { extractPublicIdFromUrl } from "../../app/utils/extractPublicIdFromUrl";
import { AppError } from "../../errors/AppError";
import { cloudinary } from "./cloudinary.config";

export const deleteImageFromCloud = async (url: string) => {
  const publicId = extractPublicIdFromUrl(url);
  try {
    if (publicId) await cloudinary.uploader.destroy(publicId);
  } catch {
    throw new AppError(sCode.BAD_REQUEST, "Cloudinary image deletion failed");
  }
};
