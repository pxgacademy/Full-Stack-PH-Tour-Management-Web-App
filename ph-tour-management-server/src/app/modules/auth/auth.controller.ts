import { Request, Response } from "express";
import passport from "passport";
import { env_config } from "../../../config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { setCookie } from "../../utils/cookie";
import {
  generateAccessTokenByRefreshToken,
  generateAllTokens,
} from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import { iUserResponse } from "../user/user.interface";
import {
  changePasswordService,
  resetPasswordService,
  setPasswordService,
} from "./auth.service";

//
export const credentialLoginController = catchAsync(
  async (req: Request, res: Response, next) => {
    passport.authenticate(
      "local",
      async (
        error: Error,
        user: Partial<iUserResponse>,
        { message }: { message: string }
      ) => {
        if (error) return next(error);
        if (!user) return next(new AppError(sCode.NOT_FOUND, message));

        const { accessToken, refreshToken } = generateAllTokens(user);
        setCookie.allTokens(res, accessToken, refreshToken);

        sendResponse(res, {
          statusCode: sCode.OK,
          message: message,
          data: user,
        });
      }
    )(req, res);
  }
);

//
export const googleLoginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { redirect } = req.query || "/";

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res);
  }
);

//
export const googleCallbackController = catchAsync(
  async (req: Request, res: Response) => {
    const redirectTo = req.query?.state || "";

    const user = req.user;
    if (!user) throw new AppError(sCode.NOT_FOUND, "User not found!");

    const { accessToken, refreshToken } = generateAllTokens(user);
    setCookie.allTokens(res, accessToken, refreshToken);

    res.redirect(`${env_config.FRONTEND_URL}${redirectTo}`);
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

//
export const forgotPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const password = await changePasswordService(req);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "Password updated successfully",
      data: password,
    });
  }
);

//
export const setPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const password = await setPasswordService(req);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "Password updated successfully",
      data: password,
    });
  }
);
