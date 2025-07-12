import { Request, Response } from "express";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { credentialLoginService } from "./auth.service";

export const credentialLoginController = catchAsync(
  async (req: Request, res: Response) => {
    const user = await credentialLoginService(req.body);

    sendResponse(res, {
      statusCode: sCode.OK,
      message: "User Logged In Successfully",
      data: user,
    });
  }
);
