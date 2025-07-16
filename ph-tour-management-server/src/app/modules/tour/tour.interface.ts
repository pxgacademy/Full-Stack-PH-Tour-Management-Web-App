import { Types } from "mongoose";

export interface iTourType {
  name: string;
}

export interface iTour {
  title: string;
  slug?: string;
  description?: string;
  images?: string[];
  location?: string;
  constFrom?: number;
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
