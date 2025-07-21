import { Document, Types } from "mongoose";

export interface iDivision extends Document {
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
}

export interface iDivisionResponse extends iDivision {
  _id: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}
