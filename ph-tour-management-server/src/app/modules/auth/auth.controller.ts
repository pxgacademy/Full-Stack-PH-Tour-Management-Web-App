import { Request, Response } from "express";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { setCookie } from "../../utils/cookie";
import {
  generateAccessTokenByRefreshToken,
  generateAllTokens,
} from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import { credentialLoginService, resetPasswordService } from "./auth.service";

//
export const credentialLoginController = catchAsync(
  async (req: Request, res: Response) => {
    const { data } = await credentialLoginService(req.body);

    const { accessToken, refreshToken } = generateAllTokens(data);
    setCookie.allTokens(res, accessToken, refreshToken);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "User logged in successfully",
      data,
    });
  }
);

//
export const getNewAccessTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      throw new AppError(sCode.BAD_REQUEST, "Refresh token not found");
    const token = await generateAccessTokenByRefreshToken(refreshToken);
    setCookie.accessToken(res, token);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "New access token retrieved successfully",
      data: token,
    });
  }
);

//
export const userLogoutController = catchAsync(
  async (req: Request, res: Response) => {
    setCookie.clearCookies(res);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "User logged out successfully",
      data: null,
    });
  }
);

//
export const resetPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const password = await resetPasswordService(req);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "Password updated successfully",
      data: password,
    });
  }
);
