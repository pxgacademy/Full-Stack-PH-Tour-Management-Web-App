import { Document, Types } from "mongoose";
import { iGlobalResponse } from "../../global-interfaces";
import { iTourResponse } from "../tour/tour.interface";
import { iUserResponse } from "../user/user.interface";

export enum eBookingStatus {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface iBooking extends Document {
  user?: Types.ObjectId;
  tour: Types.ObjectId;
  guest: number;
  payment?: Types.ObjectId;
  status: eBookingStatus;
}

export interface iBookingResponse extends iBooking, iGlobalResponse {}

export interface BookingWithRelations {
  _id: string;
  user: iUserResponse;
  tour: iTourResponse;
  createdAt: Date;
  costFrom: number;
  guest: number;
}
