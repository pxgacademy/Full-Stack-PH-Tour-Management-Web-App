import { Router } from "express";
import { roleVerifier } from "../../middlewares/roleVerifier";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import { zodValidator } from "../../middlewares/validateRequest";
import {
  createUserController,
  getAllUsersController,
  updateUserController,
} from "./user.controller";
import { eUserRoles } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const userRoutes = Router();

userRoutes.post(
  "/register",
  zodValidator(createUserZodSchema),
  createUserController
);

userRoutes.get(
  "/all-users",
  roleVerifier(eUserRoles.ADMIN, eUserRoles.SUPER_ADMIN),
  getAllUsersController
);

userRoutes.patch(
  "/:userId",
  zodValidator(updateUserZodSchema),
  tokenVerifier,
  updateUserController
);

export default userRoutes;
