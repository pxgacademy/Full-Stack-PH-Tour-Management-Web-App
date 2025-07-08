import { model, Schema } from "mongoose";
import { eIsActive, eUserRoles, iAuthProvider, iUser } from "./user.interface";

const authProviderSchema = new Schema<iAuthProvider>(
  {
    provider: { type: String },
    providerId: { type: String },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<iUser>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], trim: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: {
        values: Object.values(eIsActive),
        default: eIsActive.ACTIVE,
      },
    },
    isVerified: { type: Boolean, default: false },
    auth: [authProviderSchema],
    role: {
      type: String,
      enum: {
        values: Object.values(eUserRoles),
        default: eUserRoles.USER,
      },
    },
    // bookings: ,
    // guides: ,
  },
  { versionKey: false, timestamps: true }
);

export const User = model<iUser>("User", userSchema);
