import { JwtPayload } from "jsonwebtoken";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { sendOtpService, verifyOtpService } from "./otp.service";

export const sendOtpController = catchAsync(async (req, res) => {
  await sendOtpService(req.body.name, req.decoded as JwtPayload);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "OTP send successfully",
  });
});

export const verifyOtpController = catchAsync(async (req, res) => {
  await verifyOtpService(req.body.otp, req.decoded as JwtPayload);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "OTP verified successfully",
  });
});
