/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import sCode from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "./user.model";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });

    sendResponse(res, {
      statusCode: sCode.CREATED,
      message: "User successfully created",
      data: user,
    });
  } catch (error: any) {
    console.log("❌ Error from createUser function: ", error.message);
    next(error);
  }
};
