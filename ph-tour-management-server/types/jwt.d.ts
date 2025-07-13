import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface CustomJwtPayload extends JwtPayload {
  _id: string | Types.ObjectId;
  email: string;
  role: string;
}
