import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { transactionRollback } from "../../utils/transactionRollback";
import { generateTrxID } from "../../utils/trxIDgenerator";
import { Payment } from "../payment/payment.model";
import { iSSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { eUserRoles } from "../user/user.interface";
import { iBooking } from "./booking.interface";
import { Booking } from "./booking.model";

export const createBookingService = async (req: Request) => {
  const payload = req.body as iBooking;
  const { _id, name, email, phone, address, role } = req.decoded as JwtPayload;
  const { USER, MODERATOR } = eUserRoles;

  if (!_id) throw new AppError(sCode.UNAUTHORIZED, "Unauthorized");
  if (role === USER || role === MODERATOR) {
    if (!phone || !address) {
      throw new AppError(
        sCode.BAD_REQUEST,
        "Please complete your profile with phone and address"
      );
    }
  }

  return await transactionRollback(async (session) => {
    const booking = new Booking({ ...payload, user: _id });
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

    const sslPayload: iSSLCommerz = {
      amount: payment.amount,
      TrxID: payment.TrxID,
      name,
      email,
      phone,
      address,
    };

    const sslPayment = await sslPaymentInit(sslPayload);

    return {
      data: updatedBooking,
      options: { paymentURL: sslPayment?.GatewayPageURL },
    };
  });
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
