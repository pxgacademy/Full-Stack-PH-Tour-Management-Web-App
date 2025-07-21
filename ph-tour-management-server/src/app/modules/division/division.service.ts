import { Request } from "express";
import { AppError } from "../../../errors/AppError";
import { ReqQueryParams } from "../../global-interfaces";
import sCode from "../../statusCode";
import { QueryBuilder } from "../../utils/queryBuilder";
import { slugMaker } from "../../utils/slugMaker";
import { divisionSearchFields } from "./division.constant";
import { iDivision } from "./division.interface";
import { Division } from "./division.model";

export const createDivisionService = async (payload: iDivision) => {
  // payload.slug = slugMaker(payload.name, "division");

  const division = await Division.create(payload);
  return { data: division };
};

//
export const updateDivisionService = async (req: Request) => {
  const payload = req.body;
  const id = req.params.divisionId;
  if (payload.name) payload.slug = slugMaker(payload.name, "division");

  const division = await Division.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return { data: division };
};

//
export const deleteDivisionService = async (id: string) => {
  await Division.findByIdAndDelete(id);
};

//
export const getAllDivisionsService = async (query: ReqQueryParams) => {
  const queryBuilder = new QueryBuilder(Division, query);

  const [tours, meta] = await Promise.all([
    queryBuilder
      .search(divisionSearchFields)
      .filter()
      .sort()
      .select()
      .paginate()
      .build(),
    queryBuilder.meta(divisionSearchFields),
  ]);

  return {
    data: tours,
    meta,
  };
};

//
export const getSingleDivisionService = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division)
    throw new AppError(sCode.NOT_FOUND, "Division not found with this ID");
  return { data: division };
};
