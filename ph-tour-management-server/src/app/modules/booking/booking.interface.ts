import { Document, Types } from "mongoose";
import { iGlobalResponse } from "../../global-interfaces";

export enum eBookingStatus {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface iBooking extends Document {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guest: number;
  status: eBookingStatus;
}

export interface iBookingResponse extends iBooking, iGlobalResponse {}
