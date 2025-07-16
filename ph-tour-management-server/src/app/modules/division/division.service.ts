import { iDivision } from "./division.interface";
import { Division } from "./division.model";

export const createDivisionService = async (payload: iDivision) => {
  const division = await Division.create(payload);
  return division;
};

//
