import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createDivisionService,
  updateDivisionService,
} from "./division.service";

export const createDivisionController = catchAsync(async (req, res) => {
  const { data } = await createDivisionService(req.body);

  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "Division created successfully",
    data,
  });
});

//
export const updateDivisionController = catchAsync(async (req, res) => {
  const { data } = await updateDivisionService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Division updated successfully",
    data,
  });
});

//
