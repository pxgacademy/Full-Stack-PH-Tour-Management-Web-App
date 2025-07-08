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

interface iAuthProvider {
  provider: string; // credentials / google / facebook
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

// auth providers
/**
 * email, password
 * google authentication
 * facebook authentication
 */
