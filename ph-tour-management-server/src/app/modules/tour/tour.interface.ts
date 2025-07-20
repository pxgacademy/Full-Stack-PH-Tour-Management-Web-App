import { Document, Types } from "mongoose";

export interface iTourType {
  name: string;
}

export interface iTour extends Document {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  location?: string;
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

export interface iTourResponse extends iTour {
  _id: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}
