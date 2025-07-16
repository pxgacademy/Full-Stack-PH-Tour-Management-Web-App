import { Types } from "mongoose";

export interface iDivision {
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
