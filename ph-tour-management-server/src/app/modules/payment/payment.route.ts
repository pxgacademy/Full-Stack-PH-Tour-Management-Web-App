import { Router } from "express";
import { tokenVerifier } from "../../middlewares/tokenVerifier";
import { userAccessVerifier } from "../../middlewares/userAccessVerifier";
import {
  cancelPaymentController,
  failPaymentController,
  getInvoiceUrlController,
  repaymentController,
  successPaymentController,
} from "./payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/success", successPaymentController);
paymentRoutes.post("/fail", failPaymentController);
paymentRoutes.post("/cancel", cancelPaymentController);
paymentRoutes.post(
  "/repayment/:bookingId",
  tokenVerifier,
  userAccessVerifier,
  repaymentController
);

paymentRoutes.get(
  "/invoice/:paymentId",
  tokenVerifier,
  userAccessVerifier,
  getInvoiceUrlController
);

export default paymentRoutes;
