import { Request } from "express";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { slugMaker } from "../../utils/slugMaker";
import { iTour, iTourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

export const createTourService = async (payload: iTour) => {
  payload.slug = await slugMaker(Tour, payload.title);
  const tour = await Tour.create(payload);
  return { data: tour };
};

//
export const updateTourService = async (req: Request) => {
  const payload = req.body;
  if (payload.title) payload.slug = await slugMaker(Tour, payload.title);
  const id = req.params.tourId;
  const tour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return { data: tour };
};

//
export const deleteTourService = async (id: string) => {
  await Tour.findByIdAndDelete(id);
};

//
export const getAllToursService = async () => {
  const tours = await Tour.find();
  const total = await Tour.countDocuments();
  return { data: tours, total };
};

//
export const getSingleTourService = async (_id: string) => {
  const tour = await Tour.findOne({ _id });
  if (!tour) throw new AppError(sCode.NOT_FOUND, "Tour not found with this ID");
  return { data: tour };
};

// ------------------ Tour Type ---------------------

export const createTourTypeService = async (payload: iTourType) => {
  const tourType = await TourType.create(payload);
  return { data: tourType };
};

//
export const updateTourTypeService = async (req: Request) => {
  const id = req.params.tourTypeId;
  const tourType = await TourType.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return { data: tourType };
};

//
export const deleteTourTypeService = async (id: string) => {
  await TourType.findByIdAndDelete(id);
};

//
export const getAllTourTypesService = async () => {
  const tourTypes = await TourType.find();
  const total = await TourType.countDocuments();
  return { data: tourTypes, total };
};

//
export const getSingleTourTypeService = async (_id: string) => {
  const tourType = await TourType.findOne({ _id });
  if (!tourType)
    throw new AppError(sCode.NOT_FOUND, "TourType not found with this ID");
  return { data: tourType };
};
