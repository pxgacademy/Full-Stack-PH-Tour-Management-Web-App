import { Document, Types } from "mongoose";
import { iGlobalResponse } from "../../global-interfaces";

export enum ePaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface iPayment extends Document {
  booking: Types.ObjectId;
  TrxID: string;
  amount: number;
  paymentInfo?: unknown;
  invoiceUrl?: string;
  status: ePaymentStatus;
}

export interface iPaymentResponse extends iPayment, iGlobalResponse {}
