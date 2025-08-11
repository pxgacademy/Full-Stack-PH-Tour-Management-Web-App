import type { ComponentType } from "react";

export type { iTourType } from "./tour.type";

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

export interface iUpdateTourType {
  id: string;
  name: string;
}
