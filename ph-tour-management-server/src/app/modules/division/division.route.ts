import { Router } from "express";
import { uploadImage } from "../../../config/cloudinary/multer.config";
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
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";

const divisionRoutes = Router();

divisionRoutes.post(
  "/create",
  // roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  uploadImage.single("file"),
  zodBodyValidator(createDivisionZodSchema),
  createDivisionController
);

divisionRoutes.get("/all-divisions", getAllDivisionsController);

divisionRoutes.patch(
  "/:divisionId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  zodBodyValidator(updateDivisionZodSchema),
  updateDivisionController
);

divisionRoutes.delete(
  "/:divisionId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  deleteDivisionController
);

divisionRoutes.get("/:slug", getSingleDivisionController);

export default divisionRoutes;
