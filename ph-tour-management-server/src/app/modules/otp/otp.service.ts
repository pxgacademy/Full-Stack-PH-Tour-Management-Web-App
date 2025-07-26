import { redisClient } from "../../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";

// const OTP_PERIOD = 120;

const OTP = (length = 6): string => {
  return Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2, length + 2);
};

export const sendOtpService = async (email: string, name: string) => {
  const otp = OTP();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: 120,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP | PH Tour",
    templateName: "otp",
    templateData: {
      name,
      otp,
    },
  });
};

//
export const verifyOtpService = async () => {
  //
};
