import { Router } from "express";
import {
  getBookingStatsController,
  getPaymentStatsController,
  getTourStatsController,
  getUserStatsController,
} from "./stats.controller";

const statsRoutes = Router();

// TODO: add role verifier

statsRoutes.get("/user", getUserStatsController);
statsRoutes.get("/tour", getTourStatsController);
statsRoutes.get("/booking", getBookingStatsController);
statsRoutes.get("/payment", getPaymentStatsController);

export default statsRoutes;
