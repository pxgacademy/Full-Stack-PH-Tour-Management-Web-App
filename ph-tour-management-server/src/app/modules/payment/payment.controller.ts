import { env_config } from "../../../config";
import { catchAsync } from "../../utils/catchAsync";
import {
  cancelPaymentService,
  failPaymentService,
  successPaymentService,
} from "./payment.service";

const SSL = env_config.SSL;

export const successPaymentController = catchAsync(async (req, res) => {
  const { TrxID, amount, status } = req.query;
  const { message } = await successPaymentService(TrxID as string);

  const url = `${SSL.SSL_SUCCESS_CLIENT_URL}?TrxID=${TrxID}&amount=${amount}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const failPaymentController = catchAsync(async (req, res) => {
  const { TrxID, amount, status } = req.query;
  const { message } = await failPaymentService(TrxID as string);

  const url = `${SSL.SSL_FAIL_CLIENT_URL}?TrxID=${TrxID}&amount=${amount}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const cancelPaymentController = catchAsync(async (req, res) => {
  const { TrxID, amount, status } = req.query;
  const { message } = await cancelPaymentService(TrxID as string);

  const url = `${SSL.SSL_CANCEL_CLIENT_URL}?TrxID=${TrxID}&amount=${amount}&status=${status}&message=${message}`;

  res.redirect(url);
});
