import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createBookingService,
  getAllBookingsService,
  getSingleBookingService,
  getUserBookingsService,
  updateBookingService,
} from "./booking.service";

//
export const createBookingController = catchAsync(async (req, res) => {
  const { data } = await createBookingService(req);

  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "Booking created successfully",
    data,
  });
});

//
export const getAllBookingsController = catchAsync(async (req, res) => {
  const data = getAllBookingsService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const getUserBookingsController = catchAsync(async (req, res) => {
  const data = getUserBookingsService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const updateBookingController = catchAsync(async (req, res) => {
  const data = updateBookingService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const getSingleBookingController = catchAsync(async (req, res) => {
  const data = getSingleBookingService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});
