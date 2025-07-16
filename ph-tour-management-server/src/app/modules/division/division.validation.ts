import z from "zod";

export const DivisionZodSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be string type",
    })
    .min(2, { message: "Name must be at least 2 characters" }),
  slug: z
    .string({
      required_error: "Name slug is required",
      invalid_type_error: "Name slug must be string",
    })
    .min(2, { message: "Name slug must be at least 2 characters" }),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
