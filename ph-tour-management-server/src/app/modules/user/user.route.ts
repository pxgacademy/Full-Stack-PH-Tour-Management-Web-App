import { Router } from "express";
import { requireRole } from "../../middlewares/requireRole";
import { validateRequest } from "../../middlewares/validateRequest";
import { verifyJWT } from "../../middlewares/verifyJWT";
import {
  createUserController,
  getAllUsersController,
  updateUserController,
} from "./user.controller";
import { eUserRoles } from "./user.interface";
import { createUserZodSchema } from "./user.validation";

const userRoutes = Router();

userRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  createUserController
);

userRoutes.get(
  "/all-users",
  verifyJWT,
  requireRole(eUserRoles.ADMIN, eUserRoles.SUPER_ADMIN),
  getAllUsersController
);

userRoutes.patch("/:userId", verifyJWT, updateUserController);

export default userRoutes;
