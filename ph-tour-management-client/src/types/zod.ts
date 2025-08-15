/*

import { z } from "zod";

// ---------- Reusable helpers ---------- 
const trim = (s: unknown) =>
  typeof s === "string" ? s.trim() : s;

const emptyToUndef = (s: unknown) => {
  if (typeof s !== "string") return s;
  const v = s.trim();
  return v.length ? v : undefined;
};

// Non-empty trimmed string (for required string fields)
const NonEmptyString = z.preprocess(
  trim,
  z.string().min(1, "This field is required")
);

// Optional trimmed string ("" → undefined)
const OptionalTrimmedString = z.preprocess(
  emptyToUndef,
  z.string().optional()
);

// A relaxed URL-or-path string (allows CDN URLs or stored paths)
const UrlOrPathString = z.preprocess(
  trim,
  z
    .string()
    .min(1, "Invalid value")
    .refine(
      (v) => {
        // accept http(s) URLs OR non-empty paths without spaces at ends
        try {
          if (v.startsWith("http://") || v.startsWith("https://")) {
            new URL(v);
            return true;
          }
          // allow simple relative paths like "uploads/x.jpg"
          return !/\s/.test(v);
        } catch {
          return false;
        }
      },
      { message: "Must be a valid URL or path" }
    )
);

// Arrays of non-empty trimmed strings (optional, deduplicated, min item length)
const OptionalStringArray = z
  .array(
    z.preprocess(trim, z.string().min(1, "Empty string is not allowed"))
  )
  .transform((arr) => {
    // de-duplicate while keeping order
    const seen = new Set<string>();
    return arr.filter((x) => {
      if (seen.has(x)) return false;
      seen.add(x);
      return true;
    });
  })
  .optional();

// ---------- Field-level schemas ---------- 
const Slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .toLowerCase()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Only lowercase letters, numbers and hyphens (no leading/trailing hyphen)"
  )
  .max(100, "Slug too long");

const Title = NonEmptyString.max(200, "Title too long");

const Description = OptionalTrimmedString.max(5000, "Description too long");

const IdString = NonEmptyString.max(100, "Invalid id"); // for division, tourType (customize if UUID needed)

// Numbers come as strings in forms; coerce them safely 
const CostFrom = z
  .preprocess((v) => (v === "" ? undefined : v), z.coerce.number())
  .finite()
  .nonnegative({ message: "Must be ≥ 0" })
  .max(1_000_000_000, "Unrealistic amount")
  .optional();

const MaxGuest = z
  .preprocess((v) => (v === "" ? undefined : v), z.coerce.number())
  .int("Must be an integer")
  .positive("Must be > 0")
  .max(100_000, "Unrealistic")
  .optional();

const MinAge = z
  .preprocess((v) => (v === "" ? undefined : v), z.coerce.number())
  .int("Must be an integer")
  .nonnegative("Must be ≥ 0")
  .max(150, "Unrealistic")
  .optional();

// Dates: coerce from strings; allow empty → undefined 
const OptionalDate = z
  .preprocess((v) => (v === "" ? undefined : v), z.coerce.date())
  .optional();

// Images: You said string[]; we'll accept URLs or stored paths 
const Images = z
  .array(UrlOrPathString)
  .max(50, "Too many images")
  .optional();

const DeletedImages = z
  .array(UrlOrPathString)
  .max(100, "Too many deleted images")
  .optional();

// ---------- Main schema ---------- 
export const tourFormSchema = z
  .object({
    title: Title,
    slug: Slug,
    description: Description,
    images: Images,
    deletedImages: DeletedImages,

    location: OptionalTrimmedString?.max(300, "Too long"),
    departureLocation: OptionalTrimmedString?.max(300, "Too long"),
    arrivalLocation: OptionalTrimmedString?.max(300, "Too long"),

    costFrom: CostFrom,
    startDate: OptionalDate,
    endDate: OptionalDate,

    included: OptionalStringArray,
    excluded: OptionalStringArray,
    amenities: OptionalStringArray,
    tourPlane: OptionalStringArray,

    maxGuest: MaxGuest,
    minAge: MinAge,

    division: IdString,
    tourType: IdString,
  })
  .superRefine((data, ctx) => {
    // date range check
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }

    // if any of the location trio exists, lightly validate the rest (optional rule)
    const hasAnyLoc =
      !!data.location || !!data.departureLocation || !!data.arrivalLocation;
    if (hasAnyLoc) {
      // Example soft rule: at least 1 of departure/arrival if location present
      if (data.location && !data.departureLocation && !data.arrivalLocation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["departureLocation"],
          message: "Provide departure or arrival location",
        });
      }
    }
  });

// Infer the TypeScript type 
export type TourFormValues = z.infer<typeof tourFormSchema>;


*/

// -----------
// -----------
// -----------
// -----------
// -----------

/*
// Non-empty string with max length
const NonEmptyString = (maxLength: number) =>
  z
    .string()
    .min(1, "This field is required")
    .max(maxLength, `Must be at most ${maxLength} characters`)
    .transform((s) => s.trim());

// Arrays of non-empty trimmed strings (deduplicated, min length 1)
const StringArray = z
  .array(NonEmptyString(200)) // per item max 200 chars
  .min(1, "At least 1 item is required")
  .transform((arr) => {
    const seen = new Set<string>();
    return arr.filter((x) => {
      if (seen.has(x)) return false;
      seen.add(x);
      return true;
    });
  });

const ImagesArray = z
  .array(NonEmptyString(200))
  .max(6, "Too many images")
  .transform((arr) => {
    const seen = new Set<string>();
    return arr.filter((x) => {
      if (seen.has(x)) return false;
      seen.add(x);
      return true;
    });
  });

//** ---------- Field-level schemas ---------- 
const IdString = NonEmptyString(100);

const CostFrom = z.coerce
  .number()
  .nonnegative({ message: "Must be ≥ 0" })
  .max(1_000_000_000, "Unrealistic amount");

const MaxGuest = z.coerce
  .number()
  .int("Must be an integer")
  .positive("Must be > 0")
  .max(100_000, "Unrealistic");

const MinAge = z.coerce
  .number()
  .int("Must be an integer")
  .nonnegative("Must be ≥ 0")
  .max(150, "Unrealistic");

const DateField = z.coerce.date();

//** ---------- Main schema ---------- 
const tourFormSchema = z
  .object({
    title: NonEmptyString(200),
    description: NonEmptyString(5000),
    location: NonEmptyString(300),
    departureLocation: NonEmptyString(300),
    arrivalLocation: NonEmptyString(300),
    images: ImagesArray,
    costFrom: CostFrom,
    startDate: DateField,
    endDate: DateField,
    included: StringArray,
    excluded: StringArray,
    amenities: StringArray,
    tourPlane: StringArray,
    maxGuest: MaxGuest,
    minAge: MinAge,
    division: IdString,
    tourType: IdString,
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

  */
