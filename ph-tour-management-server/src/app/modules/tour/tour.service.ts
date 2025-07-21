import { Request } from "express";
import { AppError } from "../../../errors/AppError";
import { ReqQueryParams } from "../../global-interfaces";
import sCode from "../../statusCode";
import { QueryBuilder } from "../../utils/queryBuilder";
import { tourSearchFields } from "./tour.constant";
import { iTour, iTourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// --- CREATE TOUR ---

export const createTourService = async (payload: iTour) => {
  const tour = await Tour.create(payload);
  return { data: tour };
};

// --- UPDATE TOUR ---

export const updateTourService = async (req: Request) => {
  const id = req.params.tourId;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return { data: tour };
};

// --- DELETE TOUR ---

export const deleteTourService = async (id: string) => {
  await Tour.findByIdAndDelete(id);
};

// --- GET ALL TOURS ---

/*
export const getAllToursService = async (query: TourQueryParams) => {
  const {
    search = "",
    sort = "-createdAt",
    fields,
    page = "1",
    limit = "12",
    ...filters
  } = query;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const searchQuery = buildSearchQuery(search);
  const projection = fields?.split(",").join(" ") || "";

  // Filtered data with pagination
  const tours = await Tour.find({
    ...searchQuery,
    ...filters,
  })
    .sort(sort)
    .select(projection)
    .skip(skip)
    .limit(limitNum);

  // Total filtered count
  const filteredCount = await Tour.countDocuments({
    ...searchQuery,
    ...filters,
  });

  // Total data count (without search/filter)
  const totalDataCount = await Tour.estimatedDocumentCount();

  return {
    data: tours,
    meta: {
      total_data: totalDataCount,
      filtered_data: tours?.length || 0,
      total_page: Math.ceil(filteredCount / limitNum),
      present_page: pageNum,
      skip,
      limit: limitNum,
    },
  };
};*/

export const getAllToursService = async (query: ReqQueryParams) => {
  const queryBuilder = new QueryBuilder(Tour, query);

  const [tours, meta] = await Promise.all([
    queryBuilder
      .search(tourSearchFields)
      .filter()
      .sort()
      .select()
      .paginate()
      .build(),
    queryBuilder.meta(tourSearchFields),
  ]);

  return {
    data: tours,
    meta,
  };
};

// --- GET SINGLE TOUR ---

export const getSingleTourService = async (slug: string) => {
  const tour = await Tour.findOne({ slug });
  if (!tour) throw new AppError(sCode.NOT_FOUND, "Tour not found with this ID");
  return { data: tour };
};

// ════════════════════╣ TOUR TYPE ╠════════════════════

// --- CREATE TOUR TYPE ---

export const createTourTypeService = async (payload: iTourType) => {
  const tourType = await TourType.create(payload);
  return { data: tourType };
};

// --- UPDATE TOUR TYPE ---

export const updateTourTypeService = async (req: Request) => {
  const id = req.params.tourTypeId;
  const tourType = await TourType.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return { data: tourType };
};

// --- DELETE TOUR TYPE ---

export const deleteTourTypeService = async (id: string) => {
  await TourType.findByIdAndDelete(id);
};

// --- GET ALL TOUR TYPES ---

export const getAllTourTypesService = async () => {
  const tourTypes = await TourType.find();
  const total = await TourType.countDocuments();
  return { data: tourTypes, total };
};

// --- GET SINGLE TOUR TYPE ---

export const getSingleTourTypeService = async (_id: string) => {
  const tourType = await TourType.findOne({ _id });
  if (!tourType)
    throw new AppError(sCode.NOT_FOUND, "TourType not found with this ID");
  return { data: tourType };
};
