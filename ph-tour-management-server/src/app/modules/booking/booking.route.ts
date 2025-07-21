import { Router } from "express";
import { roleVerifier } from "../../middlewares/roleVerifier";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import { userAccessVerifier } from "../../middlewares/userAccessVerifier";
import { eUserRoles } from "../user/user.interface";
import {
  createBookingController,
  getAllBookingsController,
  getSingleBookingController,
  getUserBookingsController,
  updateBookingController,
} from "./booking.controller";

const bookingRoutes = Router();

bookingRoutes.post(
  "/create",
  tokenVerifier,
  userAccessVerifier,
  createBookingController
);

bookingRoutes.get(
  "/all",
  roleVerifier(eUserRoles.ADMIN, eUserRoles.SUPER_ADMIN),
  getAllBookingsController
);

bookingRoutes.get("/my-bookings", tokenVerifier, getUserBookingsController);

bookingRoutes.patch(
  "/:bookingId/status",
  tokenVerifier,
  updateBookingController
);

bookingRoutes.get("/:bookingId", tokenVerifier, getSingleBookingController);

export default bookingRoutes;
