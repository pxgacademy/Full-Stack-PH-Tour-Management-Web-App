import { Request } from "express";
import { iDivision } from "./division.interface";
import { Division } from "./division.model";

export const createDivisionService = async (payload: iDivision) => {
  const division = await Division.create(payload);
  return division;
};

//
export const updateDivisionService = async (req: Request) => {
  const id = req.params.divisionId;
  const division = await Division.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  return division;
};
