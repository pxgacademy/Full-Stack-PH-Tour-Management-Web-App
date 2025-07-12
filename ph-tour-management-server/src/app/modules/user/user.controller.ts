import { JwtPayload } from "jsonwebtoken";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createUserService,
  getAllUsersService,
  updateUserService,
} from "./user.service";

export const createUserController = catchAsync(async (req, res) => {
  const { data } = await createUserService(req.body);
  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "User successfully created",
    data,
  });
});

export const updateUserController = catchAsync(async (req, res) => {
  const { data } = await updateUserService(
    req.params?.userId,
    req.body,
    req.decoded as JwtPayload
  );
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User updated successfully",
    data,
  });
});

export const getAllUsersController = catchAsync(async (req, res) => {
  const { data, meta } = await getAllUsersService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Users retrieved successfully",
    data,
    meta,
  });
});
