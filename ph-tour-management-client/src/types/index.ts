export type { iLogin, iSendOtp, iUserInfo, iVerifyOtp } from "./auth.type";

export interface iResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
