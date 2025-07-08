import { Router } from "express";
import { createUserController } from "./user.controller";

const userRoutes = Router();

userRoutes.post("/register", createUserController);

export default userRoutes;
