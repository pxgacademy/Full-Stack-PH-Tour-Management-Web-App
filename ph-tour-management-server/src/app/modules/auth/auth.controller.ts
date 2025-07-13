import { Request, Response } from "express";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { generateAccessTokenByRefreshToken } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import { credentialLoginService } from "./auth.service";

export const credentialLoginController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await credentialLoginService(req.body);

    const cookieOptions = { httpOnly: true, secure: false };
    res.cookie("accessToken", data.accessToken, cookieOptions);
    res.cookie("refreshToken", data.refreshToken, cookieOptions);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "User logged in successfully",
      data,
    });
  }
);

export const getNewAccessTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      throw new AppError(sCode.BAD_REQUEST, "Refresh token not found");
    const tokenInfo = await generateAccessTokenByRefreshToken(refreshToken);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "Access token created successfully",
      data: tokenInfo,
    });
  }
);
