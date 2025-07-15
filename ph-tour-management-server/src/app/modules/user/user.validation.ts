import { z } from "zod";
import { eAuthProvider, eIsActive, eUserRoles } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(15, "Name must be at most 15 characters")
      .trim(),

    lastName: z
      .string({ required_error: "Last name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(15, "Name must be at most 15 characters")
      .trim(),
  }),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be at most 64 characters")
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "Password must contain at least one letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message:
        "Password must contain at least one special character (!@#$%^&*)",
    }),

  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^(?:\+8801|01)[0-9]{9}$/, {
      message: "Phone number must be valid Bangladeshi format",
    })
    .optional(),

  picture: z.string().url("Picture must be a valid URL").optional(),

  address: z
    .string()
    .max(250, "Address cannot exceed 250 characters")
    .trim()
    .optional(),
});

export const updateUserZodSchema = z.object({
  _id: z.union([z.string(), z.instanceof(Object)]).optional(),

  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be at most 30 characters" })
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "Password must contain at least one special character",
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^(?:\+8801|01)[0-9]{9}$/, {
      message: "Phone number must be valid Bangladeshi format",
    })
    .optional(),

  picture: z.string().url("Picture must be a valid URL").optional(),

  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .max(250, { message: "Address cannot exceed 250 characters" })
    .optional(),

  role: z
    .enum(Object.values(eUserRoles) as [string], {
      message: "Enter a valid user role",
    })
    .optional(),

  isActive: z
    .enum(Object.values(eIsActive) as [string], {
      message: "Enter a valid isActive status",
    })
    .optional(),

  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be a boolean" })
    .optional(),

  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be a boolean" })
    .optional(),

  auth: z
    .array(
      z.object({
        provider: z.enum(Object.values(eAuthProvider) as [string]),
        providerId: z.string(),
      })
    )
    .optional(),

  bookings: z.array(z.any()).optional(),
  guides: z.array(z.any()).optional(),
});
