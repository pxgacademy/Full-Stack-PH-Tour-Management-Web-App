import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserController, getAllUsersController } from "./user.controller";
import { userZodSchema } from "./user.validation";

const userRoutes = Router();

userRoutes.post(
  "/register",
  validateRequest(userZodSchema),
  createUserController
);

userRoutes.get("/all-users", getAllUsersController);

export default userRoutes;
