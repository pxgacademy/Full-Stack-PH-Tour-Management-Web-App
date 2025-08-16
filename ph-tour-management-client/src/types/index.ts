/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react";

export type { iBooking, iBookingResponse } from "./booking.type";

export type { iDivision, iDivisionResponse } from "./division.type";

export type {
  iTourResponse,
  iTourType,
  iTourTypeResponse,
  iUpdateTourType,
} from "./tour.type";

export type {
  iLogin,
  iSendOtp,
  iUserInfo,
  iVerifyOtp,
  tRole,
} from "./auth.type";

export interface iResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    total_data?: number;
    filtered_data?: number;
    present_data?: number;
    total_page?: number;
    present_page?: number;
    skip?: number;
    limit?: number;
    options?: Record<string, any>;
  };
  data: T;
}

export interface iSidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    Component: ComponentType;
  }[];
}
