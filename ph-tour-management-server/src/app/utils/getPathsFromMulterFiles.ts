export const getPathsFromMulterFiles = (
  files: Express.Multer.File[]
): string[] => files?.map((file) => file.path);
