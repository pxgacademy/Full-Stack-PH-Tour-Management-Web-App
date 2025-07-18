import { model, Schema } from "mongoose";
import { slugMaker } from "../../utils/slugMaker";
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

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugMaker(this.name, "division");
  }
  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<iDivision>;
  if (update.name) {
    update.slug = slugMaker(update.name, "division");
    this.setUpdate(update);
  }

  next();
});

export const Division = model<iDivision>("Division", divisionSchema);
