import { Request } from "express";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { checkMongoId } from "../../utils/checkMongoId";
import { eBookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { iSSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { ePaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

const updateStatus = async (
  TrxID: string,
  paymentStatus: string,
  bookingStatus: string,
  success = true,
  message: string
) => {
  const session = await Booking.startSession();

  try {
    session.startTransaction();

    const payment = await Payment.findOneAndUpdate(
      { TrxID },
      { status: paymentStatus }
    ).session(session);

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    await Booking.findByIdAndUpdate(
      payment.booking,
      { status: bookingStatus },
      { session }
    );

    await session.commitTransaction();

    return {
      success,
      message,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const successPaymentService = async (TrxID: string) => {
  return await updateStatus(
    TrxID,
    ePaymentStatus.PAID,
    eBookingStatus.COMPLETED,
    true,
    "Payment completed successfully"
  );
};

export const failPaymentService = async (TrxID: string) => {
  return await updateStatus(
    TrxID,
    ePaymentStatus.FAILED,
    eBookingStatus.FAILED,
    false,
    "Payment failed"
  );
};

export const cancelPaymentService = async (TrxID: string) => {
  return await updateStatus(
    TrxID,
    ePaymentStatus.CANCELED,
    eBookingStatus.CANCELED,
    false,
    "Payment canceled"
  );
};

export const repaymentService = async (req: Request) => {
  const id = checkMongoId(req.params?.bookingId);
  const decoded = req.decoded;

  if (!decoded) throw new AppError(sCode.UNAUTHORIZED, "Unauthorized");

  const payment = await Payment.findOne({ booking: id });

  if (!payment) {
    throw new AppError(
      sCode.NOT_FOUND,
      "Payment not found. Please book a tour"
    );
  }

  const sslPayload = {
    amount: payment.amount,
    TrxID: payment.TrxID,
    name: decoded.name,
    email: decoded.email,
    phone: decoded.phone,
    address: decoded.address,
  } as iSSLCommerz;

  const sslPayment = await sslPaymentInit(sslPayload);

  return {
    options: { paymentURL: sslPayment?.GatewayPageURL },
    message: "SSL payment url arrived successfully",
  };
};
