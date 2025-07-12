import { Router } from "express";
import { credentialLoginController } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/login", credentialLoginController);

export default authRoutes;
