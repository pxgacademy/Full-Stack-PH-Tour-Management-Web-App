import { Document, Types } from "mongoose";
import { iGlobalResponse } from "../../global-interfaces";

export interface iTourType extends Document {
  name: string;
}

export interface iTourTypeResponse extends iTourType, iGlobalResponse {}

export interface iTour extends Document {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  location?: string;
  departureLocation?: string;
  arrivalLocation?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlane?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
}

export interface iTourResponse extends iTour, iGlobalResponse {}
