import { z } from "zod";

export const userZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be into 30 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character",
    })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number" }),
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(/^(?:\+8801\d{9}01\d{9})$/, {
      message: "Enter a valid phone number",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
});
