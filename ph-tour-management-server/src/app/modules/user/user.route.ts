import { Router } from "express";
import { createUser } from "./user.controller";

const userRoutes = Router();

userRoutes.post("/register", createUser);

export default userRoutes;
