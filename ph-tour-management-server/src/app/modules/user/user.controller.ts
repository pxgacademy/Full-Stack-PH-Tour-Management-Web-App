import sCode from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { createUserService, getAllUsersService } from "./user.service";

// user/user.controller.ts
export const createUserController = catchAsync(async (req, res) => {
  const user = await createUserService(req.body);
  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "User successfully created",
    data: user,
  });
});

export const getAllUsersController = catchAsync(async (req, res) => {
  const users = await getAllUsersService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Users retrieved created",
    data: users,
  });
});
