import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserController, getAllUsersController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const userRoutes = Router();

userRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  createUserController
);

userRoutes.get("/all-users", getAllUsersController);

export default userRoutes;
