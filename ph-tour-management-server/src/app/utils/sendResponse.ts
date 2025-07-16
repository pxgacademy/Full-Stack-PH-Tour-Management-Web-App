import type { Response } from "express";

interface iApiResponse<T> {
  statusCode: number;
  message: string;
  success?: boolean;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    extra?: object;
  };
}

export const sendResponse = <T>(
  res: Response,
  payload: iApiResponse<T>
): void => {
  const {
    statusCode,
    success = true,
    message,
    data = null,
    meta = null,
  } = payload;

  res.status(statusCode).json({
    statusCode,
    success,
    message,
    meta,
    data,
  });
};
