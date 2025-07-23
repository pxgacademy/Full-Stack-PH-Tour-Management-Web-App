import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { generateTrxID } from "../../utils/trxIDgenerator";
import { Payment } from "../payment/payment.model";
import { iSSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { iBooking } from "./booking.interface";
import { Booking } from "./booking.model";

//
export const createBookingService = async (req: Request) => {
  const payload = req.body as iBooking;
  const decoded = req.decoded as JwtPayload;

  if (!decoded?._id) throw new AppError(sCode.UNAUTHORIZED, "Unauthorized");
  if (!decoded.phone || !decoded.address) {
    throw new AppError(
      sCode.BAD_REQUEST,
      "Please complete your profile with phone and address"
    );
  }

  const session = await Booking.startSession();
  try {
    session.startTransaction();

    const booking = new Booking({ ...payload, user: decoded._id });
    await booking.save({ session });

    const tour = await Tour.findById(payload.tour)
      .select("costFrom")
      .session(session);

    if (!tour || !tour.costFrom) {
      throw new AppError(sCode.BAD_REQUEST, "Tour cost not found");
    }

    const payment = new Payment({
      booking: booking._id,
      TrxID: generateTrxID(),
      amount: payload.guest * tour.costFrom,
    });
    await payment.save({ session });

    booking.payment = payment._id as Types.ObjectId;
    await booking.save({ session });

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom startDate endDate")
      .populate("payment", "TrxID amount status")
      .session(session);

    const sslPayload = {
      amount: payment.amount,
      TrxID: payment.TrxID,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
      address: decoded.address,
    } as iSSLCommerz;

    const sslPayment = await sslPaymentInit(sslPayload);

    await session.commitTransaction();
    return {
      data: updatedBooking,
      options: { paymentURL: sslPayment?.GatewayPageURL },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

//

export const getAllBookingsService = async () => {
  //
};
export const getUserBookingsService = async () => {
  //
};
export const updateBookingService = async () => {
  //
};
export const getSingleBookingService = async () => {
  //
};
