import { AppError } from "../../../errors/AppError";
import { eBookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
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
