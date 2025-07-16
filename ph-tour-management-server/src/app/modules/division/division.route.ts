import { Router } from "express";
import { roleVerifier } from "../../middlewares/roleVerifier";
import { zodValidator } from "../../middlewares/validateRequest";
import { eUserRoles } from "../user/user.interface";
import {
  createDivisionController,
  deleteDivisionController,
  getAllDivisionController,
  updateDivisionController,
} from "./division.controller";
import { DivisionZodSchema } from "./division.validation";

const divisionRoutes = Router();

divisionRoutes.post(
  "/create-division",
  zodValidator(DivisionZodSchema),
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  createDivisionController
);

divisionRoutes.patch(
  "/:divisionId",
  zodValidator(DivisionZodSchema),
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  updateDivisionController
);

divisionRoutes.delete(
  "/:divisionId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  deleteDivisionController
);

divisionRoutes.get("/all-divisions", getAllDivisionController);

export default divisionRoutes;
