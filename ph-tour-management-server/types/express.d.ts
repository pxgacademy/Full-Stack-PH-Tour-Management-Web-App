import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    decoded?: JwtPayload;
  }
}

/* // it also works
declare global {
  namespace Express {
    interface Request {
      decoded?: JwtPayload;
    }
  }
}
*/
