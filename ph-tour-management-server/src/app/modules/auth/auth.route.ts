import { Router } from "express";
import passport from "passport";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import { userAccessVerifier } from "../../middlewares/userAccessVerifier";
import {
  credentialLoginController,
  getNewAccessTokenController,
  googleCallbackController,
  googleLoginUserController,
  resetPasswordController,
  userLogoutController,
} from "./auth.controller";

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

authRoutes.get("/google", googleLoginUserController);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallbackController
);

export default authRoutes;
