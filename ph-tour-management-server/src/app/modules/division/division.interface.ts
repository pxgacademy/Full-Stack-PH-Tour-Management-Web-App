import { Document } from "mongoose";
import { iGlobalResponse } from "../../global-interfaces";

export interface iDivision extends Document {
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
}

export interface iDivisionResponse extends iDivision, iGlobalResponse {}
