import { Router } from "express";
import { uploadImage } from "../../../config/multer.config";
import { roleVerifier } from "../../middlewares/roleVerifier";
import { zodBodyValidator } from "../../middlewares/zodValidator";
import { eUserRoles } from "../user/user.interface";
import {
  createTourController,
  createTourTypeController,
  deleteTourController,
  deleteTourTypeController,
  getAllToursController,
  getAllTourTypesController,
  getSingleTourController,
  getSingleTourTypeController,
  updateTourController,
  updateTourTypeController,
} from "./tour.controller";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";

const tourRoutes = Router();

tourRoutes.post(
  "/create",
  // roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  uploadImage.array("files"),
  zodBodyValidator(createTourZodSchema),
  createTourController
);

tourRoutes.get("/all-tours", getAllToursController);

tourRoutes.patch(
  "/tour/:tourId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  zodBodyValidator(updateTourZodSchema),
  updateTourController
);

tourRoutes.delete(
  "/tour/:tourId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  deleteTourController
);

tourRoutes.get("/tour/:slug", getSingleTourController);

// ------------------ Tour Type -------------------

tourRoutes.post(
  "/create-tour-type",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  createTourTypeController
);

tourRoutes.patch(
  "/tour-type/:tourTypeId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  updateTourTypeController
);

tourRoutes.delete(
  "/tour-type/:tourTypeId",
  roleVerifier(eUserRoles.SUPER_ADMIN, eUserRoles.ADMIN),
  deleteTourTypeController
);

tourRoutes.get("/all-tour-types", getAllTourTypesController);
tourRoutes.get("/tour-type/:tourTypeId", getSingleTourTypeController);

export default tourRoutes;
