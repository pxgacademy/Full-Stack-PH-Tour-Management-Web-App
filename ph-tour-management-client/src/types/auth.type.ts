//

import type { ROLES } from "@/constants/role";

export type tRole = (typeof ROLES)[keyof typeof ROLES];

export interface iLogin {
  email: string;
  password: string;
}

export interface iSendOtp {
  email: string;
}

export interface iVerifyOtp {
  otp: string;
  email: string;
}

export interface iUserName {
  firstName: string;
  lastName: string;
}

export interface iAuth {
  provider: string;
  providerId: string;
}

export interface iUserInfo {
  _id: string;
  name: iUserName;
  email: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  auth: iAuth[];
  role: string;
  createdAt: string;
  updatedAt: string;
}
