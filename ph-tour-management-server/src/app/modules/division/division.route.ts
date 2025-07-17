import { Router } from "express";
import { roleVerifier } from "../../middlewares/roleVerifier";
import { zodBodyValidator } from "../../middlewares/zodValidator";
import { eUserRoles } from "../user/user.interface";
import {
  createDivisionController,
  deleteDivisionController,
  getAllDivisionsController,
  getSingleDivisionController,
  updateDivisionController,
} from "./division.controller";
import { DivisionZodSchema } from "./division.validation";

const divisionRoutes = Router();

divisionRoutes.post(
  "/create-division",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  zodBodyValidator(DivisionZodSchema),
  createDivisionController
);

divisionRoutes.patch(
  "/:divisionId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  zodBodyValidator(DivisionZodSchema),
  updateDivisionController
);

divisionRoutes.delete(
  "/:divisionId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  deleteDivisionController
);

divisionRoutes.get("/all-divisions", getAllDivisionsController);
divisionRoutes.get("/:divisionId", getSingleDivisionController);

export default divisionRoutes;
