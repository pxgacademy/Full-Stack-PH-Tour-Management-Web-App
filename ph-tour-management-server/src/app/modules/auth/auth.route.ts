import { Router } from "express";
import {
  credentialLoginController,
  getNewAccessTokenController,
} from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", credentialLoginController);
authRoutes.post("/refresh-token", getNewAccessTokenController);

export default authRoutes;
