import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import { validateRequest } from "../../middlewares/validateRequest";
import sCode from "../../statusCode";
import { createUserController, getAllUsersController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const userRoutes = Router();

userRoutes.post(
  "/register",
  validateRequest(createUserZodSchema),
  createUserController
);

userRoutes.get("/all-users", getAllUsersController);

export default userRoutes;

export const ad = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken)
      throw new AppError(sCode.UNAUTHORIZED, "No Token Provided");
    const isVerified = jwt.verify(accessToken, "secret");
    console.log(isVerified);
  } catch (error) {
    next(error);
  }
};
