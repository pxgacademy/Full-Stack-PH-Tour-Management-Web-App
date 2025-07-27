import { JwtPayload } from "jsonwebtoken";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { checkMongoId } from "../../utils/checkMongoId";
import { sendResponse } from "../../utils/sendResponse";
import {
  createUserService,
  getAllUsersService,
  getMeService,
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

//
export const getMeController = catchAsync(async (req, res) => {
  const id = checkMongoId(req?.decoded?._id);
  const { data } = await getMeService(id);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User retrieved successfully",
    data,
  });
});

//
export const getSingleUserController = catchAsync(async (req, res) => {
  const id = checkMongoId(req?.params?.userId);
  const { data } = await getMeService(id);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User retrieved successfully",
    data,
  });
});
