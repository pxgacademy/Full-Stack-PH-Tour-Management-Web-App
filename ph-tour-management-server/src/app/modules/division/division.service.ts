import { Request } from "express";
import { deleteImageFromCloud } from "../../../config/cloudinary/deleteImageFromCloud";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { checkMongoId } from "../../utils/checkMongoId";
import { slugMaker } from "../../utils/slugMaker";
import { transactionRollback } from "../../utils/transactionRollback";
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
/*
export const getAllDivisionsService = async (query: iReqQueryParams) => {
  const queryBuilder = new QueryBuilder(Division, query);

  const [divisions, meta] = await Promise.all([
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
    data: divisions,
    meta,
  };
};
  */

export const getAllDivisionsService = async () => {
  const divisions = await Division.find();
  const total = await Division.estimatedDocumentCount();

  return {
    data: divisions,
    meta: {
      total_data: total,
    },
  };
};

//
export const getSingleDivisionService = async (id: string) => {
  const division = await Division.findById(id);
  if (!division) throw new AppError(sCode.NOT_FOUND, "Division not found with this ID");
  return { data: division };
};
