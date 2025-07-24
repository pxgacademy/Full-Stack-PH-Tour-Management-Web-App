import { Request } from "express";
import { deleteImageFromCloud } from "../../../config/cloudinary.config";
import { AppError } from "../../../errors/AppError";
import { iReqQueryParams } from "../../global-interfaces";
import sCode from "../../statusCode";
import { checkMongoId } from "../../utils/checkMongoId";
import { QueryBuilder } from "../../utils/queryBuilder";
import { slugMaker } from "../../utils/slugMaker";
import { transactionRollback } from "../../utils/transactionRollback";
import { divisionSearchFields } from "./division.constant";
import { iDivision } from "./division.interface";
import { Division } from "./division.model";

export const createDivisionService = async (payload: iDivision) => {
  payload.slug = slugMaker(payload.name, "division");
  const division = await Division.create(payload);
  return { data: division };
};

//
export const updateDivisionService = async (req: Request) => {
  const payload = req.body;
  const id = checkMongoId(req.params.divisionId);
  if (payload.name) payload.slug = slugMaker(payload.name, "division");

  return await transactionRollback(async (session) => {
    const [oldDivision, division] = await Promise.all([
      Division.findById(id).select("thumbnail").session(session),
      Division.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
        session,
      }),
    ]);

    if (!division) {
      throw new AppError(sCode.NOT_FOUND, "Division not found");
    }

    if (payload?.thumbnail && oldDivision?.thumbnail) {
      await deleteImageFromCloud(oldDivision.thumbnail);
    }

    return { data: division };
  });
};

//
export const deleteDivisionService = async (id: string) => {
  await Division.findByIdAndDelete(id);
};

//
export const getAllDivisionsService = async (query: iReqQueryParams) => {
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
