/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import sCode from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { createUserService } from "./user.service";

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUserService(req.body);

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
