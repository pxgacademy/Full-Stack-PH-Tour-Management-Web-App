import { Router } from "express";
import { requireRole } from "../../middlewares/requireRole";
import { zodValidator } from "../../middlewares/validateRequest";
import { verifyJWT } from "../../middlewares/verifyJWT";
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
  requireRole(eUserRoles.ADMIN, eUserRoles.SUPER_ADMIN),
  getAllUsersController
);

userRoutes.patch(
  "/:userId",
  zodValidator(updateUserZodSchema),
  verifyJWT,
  updateUserController
);

export default userRoutes;
