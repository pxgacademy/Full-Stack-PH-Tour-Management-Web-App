import { Router } from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import { userAccessVerifier } from "../../middlewares/userAccessVerifier";
import {
  credentialLoginController,
  getNewAccessTokenController,
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

export default authRoutes;
