import { iReqQueryParams } from "../../global-interfaces";
import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createDivisionService,
  deleteDivisionService,
  getAllDivisionsService,
  getSingleDivisionService,
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
export const deleteDivisionController = catchAsync(async (req, res) => {
  await deleteDivisionService(req.params.divisionId);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Division deleted successfully",
  });
});

//
export const getAllDivisionsController = catchAsync(async (req, res) => {
  const { data, meta } = await getAllDivisionsService(
    req.query as iReqQueryParams
  );
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Divisions retrieved successfully",
    data,
    meta,
  });
});

//
export const getSingleDivisionController = catchAsync(async (req, res) => {
  const { data } = await getSingleDivisionService(req.params.slug);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Division retrieved successfully",
    data,
  });
});
