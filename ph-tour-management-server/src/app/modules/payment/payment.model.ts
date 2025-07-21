import { model, Schema } from "mongoose";
import { ePaymentStatus, iPayment } from "./payment.interface";

const paymentSchema = new Schema<iPayment>({
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: [true, "Booking ID is required"],
  },
  TrxID: { type: String, unique: [true, "TrxID already exist"] },
  amount: { type: Number, required: [true, "Amount is required"] },
  paymentInfo: { type: Schema.Types.Mixed },
  invoiceUrl: { type: String },
  status: {
    type: String,
    enum: {
      values: Object.values(ePaymentStatus),
      message: `Status must be in between ${Object.values(ePaymentStatus).join(", ")}`,
    },
    default: ePaymentStatus.UNPAID,
  },
});

export const Payment = model<iPayment>("Payment", paymentSchema);
