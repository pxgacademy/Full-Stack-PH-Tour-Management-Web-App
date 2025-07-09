import { Router } from "express";
import { createUserController, getAllUsersController } from "./user.controller";

const userRoutes = Router();

userRoutes.post("/register", createUserController);
userRoutes.get("/all-users", getAllUsersController);

export default userRoutes;
