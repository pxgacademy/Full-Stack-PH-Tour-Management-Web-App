import type { iDivisionResponse } from "./division.type";

export interface iTourType {
  name: string;
}

export interface iTourTypeResponse {
  name: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface iUpdateTourType {
  id: string;
  name: string;
}

export interface iTourResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  deletedImages: string[];
  location: string;
  departureLocation?: string;
  arrivalLocation?: string;
  costFrom: number;
  startDate: string;
  endDate: string;
  included: string[];
  excluded: string[];
  amenities: string[];
  tourPlane: string[];
  maxGuest: number;
  minAge: number;
  division: string | iDivisionResponse;
  tourType: string | iTourTypeResponse;
}
