import { redisClient } from "../../../config/redis.config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { OTP } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";

export const sendOtpService = async (email: string) => {
  // TODO: if user request several times in a short time, it can be a hacker, we should stop requesting.

  const user = await User.findOne({ email }).select("+isVerified");

  if (!user) throw new AppError(sCode.NOT_FOUND, "User does not exist");
  if (user.isVerified)
    throw new AppError(sCode.BAD_REQUEST, "User already verified");

  const otp = OTP();
  const redisKey = `otp:${email}`;

  await Promise.all([
    redisClient.set(redisKey, otp, {
      expiration: {
        type: "EX",
        value: 120,
      },
    }),

    sendEmail({
      to: email,
      subject: "Your OTP | PH Tour",
      templateName: "otp",
      templateData: {
        otp,
      },
    }),
  ]);
};

//
export const verifyOtpService = async (otp: string, email: string) => {
  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);
  if (!savedOtp) throw new AppError(sCode.NOT_FOUND, "OTP has been expired");
  if (savedOtp !== otp) throw new AppError(sCode.UNAUTHORIZED, "Invalid OTP");

  await Promise.all([
    User.findOneAndUpdate({ email }, { isVerified: true }),
    redisClient.del([redisKey]),
  ]);
};
