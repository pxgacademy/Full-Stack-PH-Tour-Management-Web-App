//

interface Options {
  random?: boolean;
  ext?: boolean;
}

export const sanitizeFilename = (
  filename: string,
  options: Options = { random: true, ext: false }
): string => {
  const { random = true, ext = true } = options;

  const lastDotIndex = filename.lastIndexOf(".");
  const hasExtension =
    lastDotIndex !== -1 && lastDotIndex < filename.length - 1;

  const name = hasExtension ? filename.slice(0, lastDotIndex) : filename;
  const extension = hasExtension
    ? filename.slice(lastDotIndex + 1).toLowerCase()
    : "";

  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const randomStr = Math.random().toString(36).slice(2, 10); // 8-char
  const timestamp = Date.now();
  const dotExt = ext && extension ? `.${extension}` : "";

  if (random) return `${cleaned}-${randomStr}-${timestamp}${dotExt}`;
  else return `${cleaned}${dotExt}`;
};

/*
export const sanitizeFilename = (
  filename: string,
  { random = true, ext = false }
): string => {
  const [name, extension] = filename.split(/\.(?=[^.]+$)/);

  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const randomStr = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now();
  const dotExt = `.${extension.toLowerCase()}`;

  if (random) return `${cleaned}-${randomStr}-${timestamp}${ext && dotExt}`;
  else return `${cleaned}${ext && dotExt}`;
};
*/
