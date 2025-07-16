import sCode from "../../statusCode";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { createDivisionService } from "./division.service";

export const createDivisionController = catchAsync(async (req, res) => {
  const data = createDivisionService(req.body);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Division created successfully",
    data,
  });
});
