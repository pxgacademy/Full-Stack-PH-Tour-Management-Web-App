import type { Response } from "express";

interface iApiResponse<T> {
  statusCode: number;
  message: string;
  success?: boolean;
  data?: T;
  meta?: {
    total_data?: number;
    filtered_data?: number;
    present_data?: number;
    total_page?: number;
    present_page?: number;
    skip?: number;
    limit?: number;
    options?: object;
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
