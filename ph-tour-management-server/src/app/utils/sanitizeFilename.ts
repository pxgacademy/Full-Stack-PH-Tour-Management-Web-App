//

interface Options {
  random?: boolean;
  extension?: boolean;
}

export const sanitizeFilename = (
  filename: string,
  options: Options = { random: true, extension: false }
): string => {
  const { random = true, extension = true } = options;

  const lastDotIndex = filename.lastIndexOf(".");
  const hasExt = lastDotIndex !== -1 && lastDotIndex < filename.length - 1;

  const name = hasExt ? filename.slice(0, lastDotIndex) : filename;
  const ext = hasExt ? filename.slice(lastDotIndex + 1).toLowerCase() : "";

  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const randomStr = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now();
  const dotExt = extension && ext ? `.${ext}` : "";

  if (random) return `${cleaned}-${randomStr}-${timestamp}${dotExt}`;
  else return `${cleaned}${dotExt}`;
};

/*







export const sanitizeFilename = (
  filename: string,
  { random = true, extension = false }
): string => {
  const [name, ext] = filename.split(/\.(?=[^.]+$)/);

  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const randomStr = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now();
  const dotExt = `.${ext.toLowerCase()}`;

  if (random) return `${cleaned}-${randomStr}-${timestamp}${extension && dotExt}`;
  else return `${cleaned}${extension && dotExt}`;
};
*/
