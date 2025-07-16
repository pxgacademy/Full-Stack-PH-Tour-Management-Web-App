import { Request } from "express";
import { iDivision } from "./division.interface";
import { Division } from "./division.model";

export const createDivisionService = async (payload: iDivision) => {
  const division = await Division.create(payload);
  return { data: division };
};

//
export const updateDivisionService = async (req: Request) => {
  const id = req.params.divisionId;
  const division = await Division.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  return { data: division };
};

//
export const deleteDivisionService = async (id: string) => {
  await Division.findByIdAndDelete(id);
};

//
export const getAllDivisionService = async () => {
  const divisions = await Division.find();
  return { data: divisions };
};
