import { Request } from "express";
import { uploadBufferToCloud } from "../../../config/cloudinary/uploadBufferToCloud";
import { AppError } from "../../../errors/AppError";
import { PAYMENT_MESSAGES } from "../../constants/messages/paymentMessages";
import sCode from "../../statusCode";
import { checkMongoId } from "../../utils/checkMongoId";
import { formatDate } from "../../utils/formatDate";
import { InvoiceData } from "../../utils/invoice";
import { sendBookingInvoice } from "../../utils/sendBookingInvoice";
import { transactionRollback } from "../../utils/transactionRollback";
import {
  BookingWithRelations,
  eBookingStatus,
} from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { iSSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { iTourResponse } from "../tour/tour.interface";
import { iUserResponse } from "../user/user.interface";
import { ePaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

interface UpdateStatusParams {
  TrxID: string;
  paymentStatus: ePaymentStatus;
  bookingStatus: eBookingStatus;
  success: boolean;
  message: string;
  paymentInfo?: object;
}

const processPaymentStatusUpdate = async ({
  TrxID,
  paymentStatus,
  bookingStatus,
  success,
  message,
  paymentInfo = {},
}: UpdateStatusParams) => {
  return await transactionRollback(async (session) => {
    const payment = await Payment.findOneAndUpdate(
      { TrxID },
      { status: paymentStatus, paymentInfo },
      { new: true }
    ).session(session);

    if (!payment) throw new AppError(404, "Payment not found");

    const booking = (await Booking.findByIdAndUpdate(
      payment.booking,
      { status: bookingStatus },
      { new: true, session }
    )
      .populate<{ user: iUserResponse }>("user", "name email")
      .populate<{ tour: iTourResponse }>(
        "tour",
        "title costFrom"
      )) as unknown as BookingWithRelations;

    if (!booking) throw new AppError(404, "Booking not found");

    const { user, tour } = booking;
    if (!user || !tour) throw new AppError(404, "Booking data incomplete");

    if (success) {
      const data: InvoiceData = {
        name: `${user.name.firstName} ${user.name.lastName}`,
        email: user.email,
        bookingId: booking._id,
        tourTitle: tour.title,
        bookingDate: formatDate(booking.createdAt),
        paymentId: String(payment._id),
        TrxId: payment.TrxID,
        amountPerGuest: tour.costFrom as number,
        totalGuests: booking.guest,
        amount: payment.amount,
        paymentMethod: payment.paymentInfo?.card_type || "N/A",
      };

      const pdfBuffer = await sendBookingInvoice(user.email, data);
      const cloudResult = await uploadBufferToCloud(pdfBuffer, "invoice");

      payment.invoiceUrl = cloudResult?.secure_url || "";
      await payment.save();
    }

    return { success, message };
  });
};

export const successPaymentService = async (req: Request) => {
  return await processPaymentStatusUpdate({
    TrxID: (req.query?.TrxID as string) || "",
    paymentInfo: req.body,
    paymentStatus: ePaymentStatus.PAID,
    bookingStatus: eBookingStatus.COMPLETED,
    success: true,
    message: PAYMENT_MESSAGES.SUCCESS,
  });
};

export const failPaymentService = async (TrxID: string) => {
  return await processPaymentStatusUpdate({
    TrxID,
    paymentStatus: ePaymentStatus.FAILED,
    bookingStatus: eBookingStatus.FAILED,
    success: false,
    message: PAYMENT_MESSAGES.FAILED,
  });
};

export const cancelPaymentService = async (TrxID: string) => {
  return await processPaymentStatusUpdate({
    TrxID,
    paymentStatus: ePaymentStatus.CANCELED,
    bookingStatus: eBookingStatus.CANCELED,
    success: false,
    message: PAYMENT_MESSAGES.CANCELED,
  });
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

//
export const getInvoiceUrlService = async (paymentId: string) => {
  const id = checkMongoId(paymentId);
  const payment = await Payment.findById(id).select("+invoiceUrl");

  if (!payment) throw new AppError(sCode.NOT_FOUND, "Payment not found");
  if (!payment.invoiceUrl)
    throw new AppError(sCode.NOT_FOUND, "Payment not found");

  return { data: payment };
};
