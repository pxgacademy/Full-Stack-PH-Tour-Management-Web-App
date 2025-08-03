import { env_config } from "../../../config";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { validationPayment } from "../sslCommerz/sslCommerz.service";
import {
  cancelPaymentService,
  failPaymentService,
  getInvoiceUrlService,
  repaymentService,
  successPaymentService,
} from "./payment.service";

const SSL = env_config.SSL;

export const successPaymentController = catchAsync(async (req, res) => {
  const { TrxID, amount, status } = req.query;
  const { message } = await successPaymentService(req);

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

//
export const getInvoiceUrlController = catchAsync(async (req, res) => {
  const { data } = await getInvoiceUrlService(req.params?.paymentId || "");

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const validatePaymentController = catchAsync(async (req, res) => {
  await validationPayment(req.body);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Payment validated successfully",
  });
});
