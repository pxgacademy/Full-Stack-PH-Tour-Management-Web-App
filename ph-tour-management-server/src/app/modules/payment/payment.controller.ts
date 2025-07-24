import { env_config } from "../../../config";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  cancelPaymentService,
  failPaymentService,
  repaymentService,
  successPaymentService,
} from "./payment.service";

const SSL = env_config.SSL;

export const successPaymentController = catchAsync(async (req, res) => {
  const { TrxID, amount, status } = req.query;
  const { message } = await successPaymentService(TrxID as string);

  const url = `${SSL.SUCCESS_CLIENT_URL}?TrxID=${TrxID}&amount=${amount}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const failPaymentController = catchAsync(async (req, res) => {
  const { TrxID, amount, status } = req.query;
  const { message } = await failPaymentService(TrxID as string);

  const url = `${SSL.FAIL_CLIENT_URL}?TrxID=${TrxID}&amount=${amount}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const cancelPaymentController = catchAsync(async (req, res) => {
  const { TrxID, amount, status } = req.query;
  const { message } = await cancelPaymentService(TrxID as string);

  const url = `${SSL.CANCEL_CLIENT_URL}?TrxID=${TrxID}&amount=${amount}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const repaymentController = catchAsync(async (req, res) => {
  const { options, message } = await repaymentService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: message,
    data: null,
    meta: { options },
  });
});
