import { Router } from "express";
import { roleVerifier } from "../../middlewares/roleVerifier";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import { zodBodyValidator } from "../../middlewares/zodValidator";
import {
  createUserController,
  getAllUsersController,
  getMeController,
  getSingleUserController,
  updateUserController,
} from "./user.controller";
import { eUserRoles } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const userRoutes = Router();

userRoutes.post(
  "/register",
  zodBodyValidator(createUserZodSchema),
  createUserController
);

userRoutes.get(
  "/all-users",
  roleVerifier(eUserRoles.ADMIN, eUserRoles.SUPER_ADMIN),
  getAllUsersController
);

userRoutes.get("/me", tokenVerifier, getMeController);
userRoutes.get(
  "/:userId",
  roleVerifier(eUserRoles.ADMIN, eUserRoles.SUPER_ADMIN),
  getSingleUserController
);

userRoutes.patch(
  "/:userId",
  zodBodyValidator(updateUserZodSchema),
  tokenVerifier,
  updateUserController
);

export default userRoutes;
