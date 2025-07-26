import { JwtPayload } from "jsonwebtoken";
import { redisClient } from "../../../config/redis.config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { OTP } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";

export const sendOtpService = async (name: string, decoded: JwtPayload) => {
  // TODO: if user request random times in a short time, it can be a hacker, we should stop requesting.

  const { _id, email } = decoded;

  const user = await User.findById(_id).select("+isVerified");

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
        name,
        otp,
      },
    }),
  ]);
};

//
export const verifyOtpService = async (otp: string, decoded: JwtPayload) => {
  const { _id, email } = decoded;
  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);
  if (!savedOtp) throw new AppError(sCode.NOT_FOUND, "OTP has been expired");
  if (savedOtp !== otp) throw new AppError(sCode.UNAUTHORIZED, "Invalid OTP");

  await Promise.all([
    User.findByIdAndUpdate(_id, { isVerified: true }),
    redisClient.del([redisKey]),
  ]);
};
