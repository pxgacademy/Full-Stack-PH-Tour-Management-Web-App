import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { sanitizeFilename } from "../../app/utils/sanitizeFilename";
import { cloudinary } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    public_id: (req, file) => sanitizeFilename(file.originalname),
  },
});

export const uploadImage = multer({ storage });
