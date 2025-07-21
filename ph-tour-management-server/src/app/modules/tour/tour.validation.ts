import z from "zod";

export const createTourZodSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Title must be string type",
      required_error: "Title is required",
    })
    .min(5, { message: "Title must be at least 5 characters long" }),
  /* slug: z
    .string({
      invalid_type_error: "Slug must be string type",
      required_error: "Slug is required",
    })
    .min(5, { message: "Slug must be at least 5 characters long" }),*/
  description: z
    .string({ invalid_type_error: "Description must be string type" })
    .optional(),
  images: z
    .array(z.string().url({ message: "Images must be valid URL" }))
    .optional(),
  location: z
    .string({ invalid_type_error: "Location must be string type" })
    .optional(),
  departureLocation: z
    .string({ invalid_type_error: "DepartureLocation must be string type" })
    .optional(),
  arrivalLocation: z
    .string({ invalid_type_error: "ArrivalLocation must be string type" })
    .optional(),
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
  division: z.string({ invalid_type_error: "Division bust be string type" }),
  tourType: z.string({ invalid_type_error: "Tour type bust be string type" }),
});

export const updateTourZodSchema = createTourZodSchema.partial();
// export const updateTourZodSchema = createTourZodSchema.required();
