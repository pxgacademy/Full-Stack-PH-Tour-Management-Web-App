import { model, Schema } from "mongoose";
import { slugMaker } from "../../utils/slugMaker";
import { iTour, iTourType } from "./tour.interface";

const tourTypeSchema = new Schema<iTourType>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: [true, "This tour type already exist"],
    },
  },
  { versionKey: false, timestamps: true }
);

const tourSchema = new Schema<iTour>(
  {
    title: { type: String, trim: true, required: [true, "Title is required"] },
    slug: { type: String, required: [true, "Title slug already exist"] },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlane: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: [true, "Division ID is required"],
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: [true, "Tour type ID is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.slug = slugMaker(this.title);
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<iTour>;
  if (update.title) {
    update.slug = slugMaker(update.title);
    this.setUpdate(update);
  }

  next();
});

export const TourType = model<iTourType>("TourType", tourTypeSchema);
export const Tour = model<iTour>("Tour", tourSchema);
