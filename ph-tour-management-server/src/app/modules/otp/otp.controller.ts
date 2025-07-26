import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { sendOtpService, verifyOtpService } from "./otp.service";

export const sendOtpController = catchAsync(async (req, res) => {
  const { email, name } = req.body;
  await sendOtpService(email, name);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "OTP send successfully",
  });
});

export const verifyOtpController = catchAsync(async (req, res) => {
  verifyOtpService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "OTP verified successfully",
  });
});
