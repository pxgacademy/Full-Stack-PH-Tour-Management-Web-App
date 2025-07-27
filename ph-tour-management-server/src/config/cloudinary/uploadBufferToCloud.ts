import { UploadApiResponse } from "cloudinary";
import sCode from "../../app/statusCode";
import logger from "../../app/utils/logger";
import { sanitizeFilename } from "../../app/utils/sanitizeFilename";
import { AppError } from "../../errors/AppError";
import { cloudinary } from "./cloudinary.config";
import { streamFromBuffer } from "./streamFromBuffer";

/**
 * Uploads a buffer (e.g. PDF) to Cloudinary under 'pdf/' folder
 * @param buffer - The file content as a buffer
 * @param filename - Original file name
 * @returns Cloudinary UploadApiResponse
 */

export const uploadBufferToCloud = async (
  buffer: Buffer,
  filename: string
): Promise<UploadApiResponse> => {
  const public_id = sanitizeFilename(filename);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id,
        folder: "pdf",
      },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload error", {
            error: error.message,
            filename,
          });
          return reject(error);
        }

        if (!result) {
          const fallbackError = new AppError(
            sCode.EXPECTATION_FAILED,
            "Cloudinary returned no result"
          );
          logger.error("Upload failed", { filename });
          return reject(fallbackError);
        }

        resolve(result);
      }
    );

    const stream = streamFromBuffer(buffer);
    stream.pipe(uploadStream);
  });
};

/*
export const uploadBufferToCloud = async (buffer: Buffer, filename: string
): Promise<UploadApiResponse> => {
  const public_id = sanitizeFilename(filename)


  try {
    return new Promise((resolve, reject) => {

      const bufferStream = new Stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    //
  } catch (error) {
    logger.error("Error uploading file", {
      error: error instanceof Error ? error.message : error,
    });
  }
};
*/
