import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  getBookingStatsService,
  getPaymentStatsService,
  getTourStatsService,
  getUserStatsService,
} from "./stats.service";

//
export const getUserStatsController = catchAsync(async (req, res) => {
  const data = await getUserStatsService();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const getTourStatsController = catchAsync(async (req, res) => {
  getTourStatsService();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
  });
});

//
export const getBookingStatsController = catchAsync(async (req, res) => {
  getBookingStatsService();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
  });
});

//
export const getPaymentStatsController = catchAsync(async (req, res) => {
  getPaymentStatsService();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
  });
});
