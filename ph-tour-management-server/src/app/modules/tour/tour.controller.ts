import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createTourService,
  createTourTypeService,
  deleteTourService,
  deleteTourTypeService,
  getAllToursService,
  getAllTourTypesService,
  getSingleTourService,
  getSingleTourTypeService,
  updateTourService,
  updateTourTypeService,
} from "./tour.service";

export const createTourController = catchAsync(async (req, res) => {
  const { data } = await createTourService(req.body);

  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "Tour created successfully",
    data,
  });
});

//
export const updateTourController = catchAsync(async (req, res) => {
  const { data } = await updateTourService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Tour updated successfully",
    data,
  });
});

//
export const deleteTourController = catchAsync(async (req, res) => {
  await deleteTourService(req.params.tourId);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Tour deleted successfully",
  });
});

//
export const getAllToursController = catchAsync(async (req, res) => {
  const { data, total } = await getAllToursService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Tours retrieved successfully",
    data,
    meta: { total },
  });
});

//
export const getSingleTourController = catchAsync(async (req, res) => {
  const { data } = await getSingleTourService(req.params.tourId);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Tour retrieved successfully",
    data,
  });
});

// --------------- Tour Type ----------------

export const createTourTypeController = catchAsync(async (req, res) => {
  const { data } = await createTourTypeService(req.body);

  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "TourType created successfully",
    data,
  });
});

//
export const updateTourTypeController = catchAsync(async (req, res) => {
  const { data } = await updateTourTypeService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "TourType updated successfully",
    data,
  });
});

//
export const deleteTourTypeController = catchAsync(async (req, res) => {
  await deleteTourTypeService(req.params.tourTypeId);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "TourType deleted successfully",
  });
});

//
export const getAllTourTypesController = catchAsync(async (req, res) => {
  const { data, total } = await getAllTourTypesService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "TourTypes retrieved successfully",
    data,
    meta: { total },
  });
});

//
export const getSingleTourTypeController = catchAsync(async (req, res) => {
  const { data } = await getSingleTourTypeService(req.params.tourTypeId);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "TourType retrieved successfully",
    data,
  });
});
