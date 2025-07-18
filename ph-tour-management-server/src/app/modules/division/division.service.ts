import { Request } from "express";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { slugMaker } from "../../utils/slugMaker";
import { iDivision } from "./division.interface";
import { Division } from "./division.model";

export const createDivisionService = async (payload: iDivision) => {
  payload.slug = await slugMaker(Division, payload.name, "division");

  const division = await Division.create(payload);
  return { data: division };
};

//
export const updateDivisionService = async (req: Request) => {
  const payload = req.body;
  const id = req.params.divisionId;
  if (payload.name)
    payload.slug = await slugMaker(Division, payload.name, "division");

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
export const getAllDivisionsService = async () => {
  const divisions = await Division.find();
  const total = await Division.countDocuments();
  return { data: divisions, total };
};

//
export const getSingleDivisionService = async (_id: string) => {
  const division = await Division.findOne({ _id });
  if (!division)
    throw new AppError(sCode.NOT_FOUND, "division not found with this ID");
  return { data: division };
};
