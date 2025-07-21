import { model, Schema } from "mongoose";
import { eBookingStatus, iBooking } from "./booking.interface";

const bookingSchema = new Schema<iBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Tour ID is required"],
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    guest: { type: Number, required: [true, "Guest is required"] },
    status: {
      type: String,
      enum: {
        values: Object.values(eBookingStatus),
        message: `Status must be in between ${Object.values(eBookingStatus).join(", ")}`,
      },
      default: eBookingStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Booking = model<iBooking>("Booking", bookingSchema);
