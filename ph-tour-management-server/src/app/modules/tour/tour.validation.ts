import z from "zod";

export const createTourZodSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Title must be string type",
      required_error: "Title is required",
    })
    .min(5, { message: "Title must be at least 5 characters long" }),
  slug: z
    .string({
      invalid_type_error: "Slug must be string type",
      required_error: "Slug is required",
    })
    .min(5, { message: "Slug must be at least 5 characters long" }),
  description: z
    .string({ invalid_type_error: "Description must be string type" })
    .optional(),
  images: z
    .array(z.string().url({ message: "Images must be valid URL" }))
    .optional(),
  location: z.string().optional(),
  costFrom: z
    .number({ invalid_type_error: "Cost must be number type" })
    .optional(),
  startDate: z
    .date({ invalid_type_error: "Start date must be date type" })
    .optional(),
  endDate: z
    .date({ invalid_type_error: "End date must be date type" })
    .optional(),
  included: z
    .array(z.string({ invalid_type_error: "Included must be string type" }))
    .optional(),
  excluded: z
    .array(z.string({ invalid_type_error: "Excluded must be string type" }))
    .optional(),
  amenities: z
    .array(z.string({ invalid_type_error: "Amenities must be string type" }))
    .optional(),
  tourPlane: z
    .array(z.string({ invalid_type_error: "Tour plane must be string type" }))
    .optional(),
  maxGuest: z
    .number({ invalid_type_error: "Max guest must be number type" })
    .optional(),
  minAge: z
    .number({ invalid_type_error: "Min age must be number type" })
    .optional(),
  division: z
    .string({ invalid_type_error: "Division bust be string type" })
    .optional(),
  tourType: z
    .string({ invalid_type_error: "Tour type bust be string type" })
    .optional(),
});

export const updateTourZodSchema = createTourZodSchema.partial();
// export const updateTourZodSchema = createTourZodSchema.required();

// .partial() make every field optional
// .required() make every field required

/*
import { z } from "zod";

const baseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const extendedUserSchema = baseUserSchema.extend({
  age: z.number().min(0),
  isAdmin: z.boolean().optional(),
});

const extendedUserSchema = baseUserSchema.partial().extend({
  age: z.number().min(0),
  isAdmin: z.boolean().optional(),
});


const schemaA = z.object({ a: z.string() });
const schemaB = z.object({ b: z.number() });

const merged = schemaA.merge(schemaB);

*/
