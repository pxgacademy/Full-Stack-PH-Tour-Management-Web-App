import z from "zod";

export const tourFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    // description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    departureLocation: z.string().min(1, "Departure location is required"),
    arrivalLocation: z.string().min(1, "Arrival location is required"),

    costFrom: z.number().min(0, "Cost must be a positive number").max(999999, "Cost too high"),

    startDate: z.date({
      error: () => ({ message: "Start date is required" }),
    }),
    endDate: z.date({
      error: () => ({ message: "End date is required" }),
    }),

    included: z
      .array(
        z.object({
          value: z.string().min(1, "Include item is required"),
        })
      )
      .min(1, "At least one included item required"),

    excluded: z
      .array(
        z.object({
          value: z.string().min(1, "Exclude item is required"),
        })
      )
      .min(1, "At least one excluded item required"),

    amenities: z
      .array(
        z.object({
          value: z.string().min(1, "Amenity is required"),
        })
      )
      .min(1, "At least one amenity required"),

    tourPlane: z
      .array(
        z.object({
          value: z.string().min(1, "Tour plan is required"),
        })
      )
      .min(1, "At least one tour plan required"),

    maxGuest: z.number().min(1, "At least 1 guest required").max(999, "Too many guests"),

    minAge: z.number().min(1, "Minimum age must be at least 1").max(100, "Invalid age"),

    division: z.string().min(1, "Division is required"),
    tourType: z.string().min(1, "Tour type is required"),
  })
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }
  });

export type TourFormValues = z.infer<typeof tourFormSchema>;
