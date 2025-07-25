import { Router } from "express";
import passport from "passport";
import { env_config } from "../../../config";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import { userAccessVerifier } from "../../middlewares/userAccessVerifier";
import {
  changePasswordController,
  credentialLoginController,
  getNewAccessTokenController,
  googleCallbackController,
  googleLoginUserController,
  resetPasswordController,
  setPasswordController,
  userLogoutController,
} from "./auth.controller";

const failureRedirect = `${env_config.FRONTEND_URL}/login?error=We are unable to log you in at the moment due to an issue with your account. Please try again shortly or reach out to our support team for assistance.`;

const authRoutes = Router();

authRoutes.post("/login", credentialLoginController);
authRoutes.post("/refresh-token", getNewAccessTokenController);
authRoutes.post("/logout", userLogoutController);
authRoutes.post(
  "/reset-password",
  tokenVerifier,
  userAccessVerifier,
  resetPasswordController
);
authRoutes.post(
  "/change-password",
  tokenVerifier,
  userAccessVerifier,
  changePasswordController
);
authRoutes.post(
  "/set-password",
  tokenVerifier,
  userAccessVerifier,
  setPasswordController
);

authRoutes.get("/google", googleLoginUserController);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect }),
  googleCallbackController
);

export default authRoutes;
