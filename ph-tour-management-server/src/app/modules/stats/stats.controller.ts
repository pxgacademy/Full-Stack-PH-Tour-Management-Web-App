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
  const data = await getTourStatsService();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const getBookingStatsController = catchAsync(async (req, res) => {
  const data = await getBookingStatsService();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const getPaymentStatsController = catchAsync(async (req, res) => {
  const data = await getPaymentStatsService();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});
