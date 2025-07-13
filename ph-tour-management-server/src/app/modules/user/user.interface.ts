import { Types } from "mongoose";

export enum eUserRoles {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export enum eIsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum eAuthProvider {
  google = "google",
  facebook = "facebook",
  credentials = "credentials",
}

export interface iAuthProvider {
  provider: eAuthProvider; // credentials / google / facebook
  providerId: string;
}

export interface iUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: eIsActive;
  isVerified?: boolean;
  auth: iAuthProvider[];
  role: eUserRoles;
  bookings: Types.ObjectId[];
  guides: Types.ObjectId[];
}

export interface iUserResponse extends iUser {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// auth providers
/**
 * email, password
 * google authentication
 * facebook authentication
 */
