import { Router } from "express";
import {
  credentialLoginController,
  getNewAccessTokenController,
  userLogoutController,
} from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", credentialLoginController);
authRoutes.post("/refresh-token", getNewAccessTokenController);
authRoutes.post("/logout", userLogoutController);

export default authRoutes;
