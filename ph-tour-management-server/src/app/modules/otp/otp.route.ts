import { Router } from "express";
import { sendOtpController, verifyOtpController } from "./otp.controller";

const otpRoutes = Router();

otpRoutes.post("/send", sendOtpController);
otpRoutes.post("/verify", verifyOtpController);

export default otpRoutes;
