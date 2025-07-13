import { Response } from "express";

export const setCookie = {
  cookieOptions: { httpOnly: true, secure: false },
  accessToken(res: Response, token: string) {
    res.cookie("accessToken", token, this.cookieOptions);
  },
  refreshToken(res: Response, token: string) {
    res.cookie("refreshToken", token, this.cookieOptions);
  },
  allTokens(res: Response, accessToken: string, refreshToken: string) {
    this.accessToken(res, accessToken);
    this.refreshToken(res, refreshToken);
  },
  clearCookies(res: Response) {
    res.clearCookie("accessToken", { ...this.cookieOptions, sameSite: "lax" });
    res.clearCookie("refreshToken", { ...this.cookieOptions, sameSite: "lax" });
  },
};
