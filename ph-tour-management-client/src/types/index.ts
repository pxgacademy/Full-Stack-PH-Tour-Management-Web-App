export type { iLogin, iSendOtp, iVerifyOtp } from "./auth.type";

export interface iResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
