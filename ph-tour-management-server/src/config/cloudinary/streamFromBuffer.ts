import { PassThrough } from "stream";

export const streamFromBuffer = (buffer: Buffer): NodeJS.ReadableStream => {
  const stream = new PassThrough();
  stream.end(buffer);
  return stream;
};
