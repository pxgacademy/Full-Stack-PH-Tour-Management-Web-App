import { Router } from "express";
import {
  cancelPaymentController,
  failPaymentController,
  successPaymentController,
} from "./payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/success", successPaymentController);
paymentRoutes.post("/fail", failPaymentController);
paymentRoutes.post("/cancel", cancelPaymentController);

export default paymentRoutes;
