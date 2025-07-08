// utils/sendResponse.ts
import { Response } from "express";

interface IApiResponse<T> {
  success?: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  statusCode: number;
}

export const sendResponse = <T>(
  res: Response,
  payload: IApiResponse<T>
): void => {
  const { statusCode, success = true, message, data, meta = null } = payload;

  res.status(statusCode).json({
    success,
    message,
    meta,
    data,
  });
};
