import { model, Schema } from "mongoose";
import { iDivision } from "./division.interface";

const divisionSchema = new Schema<iDivision>(
  {
    name: {
      type: String,
      required: [true, "Division is required"],
      unique: [true, "Division already exist"],
    },
    slug: { type: String, unique: [true, "Division slug already exist"] },
    thumbnail: { type: String },
    description: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export const Division = model<iDivision>("Division", divisionSchema);
