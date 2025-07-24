//

export const sanitizeFilename = (filename: string, random = true): string => {
  const [name, ext] = filename.split(/\.(?=[^.]+$)/);

  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const randomStr = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now();

  if (random)
    return `${cleaned}-${randomStr}-${timestamp}.${ext.toLowerCase()}`;
  else return `${cleaned}.${ext.toLowerCase()}`;
};
