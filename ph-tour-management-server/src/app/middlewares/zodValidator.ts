import { NextFunction, Request, Response } from "express";
import z, { AnyZodObject } from "zod";

interface PQSchema {
  paramsSchema?: AnyZodObject;
  querySchema?: AnyZodObject;
}

export const zodBodyValidator =
  (zodSchema: AnyZodObject, params?: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body?.data;
      req.body = data ? JSON.parse(data) : req.body;
      req.body = await zodSchema.parseAsync(req.body);
      if (params) req.params = params.parse(req.params);

      next();
    } catch (error) {
      next(error);
    }
  };

export const zodPQValidator =
  ({ paramsSchema, querySchema }: PQSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (paramsSchema) req.params = paramsSchema.parse(req.params);
      if (querySchema) req.params = querySchema.parse(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };

export const paramsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid ID format",
    })
    .optional(),
  email: z.string().email({ message: "Invalid Email" }).optional(),
});

export const querySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a number" })
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, { message: "Limit must be a number" })
    .optional(),
});
