import { z } from "zod";
import { eIsActive, eUserRoles } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be into 30 characters" }),
  email: z.string().email({ message: "Enter a valid email address" }),
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

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be into 30 characters" })
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character",
    })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number" })
    .optional(),
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

  role: z
    .enum(Object.values(eUserRoles) as [string], {
      message: "Enter a valid user role",
    })
    .optional(),
  isActive: z
    .enum(Object.values(eIsActive) as [string], {
      message: "Enter a valid isActive role",
    })
    .optional(),
  isDeleted: z
    .boolean({ message: "Is delete must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ message: "Is verified must be true or false" })
    .optional(),
});
