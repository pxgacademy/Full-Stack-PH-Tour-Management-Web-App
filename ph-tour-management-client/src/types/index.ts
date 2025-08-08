export type { iLogin, iSendOtp } from "./auth.type";

export interface iResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
