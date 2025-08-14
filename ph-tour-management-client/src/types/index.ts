import type { ComponentType } from "react";

export type { iDivision, iDivisionResponse } from "./division.type";

export type {
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
