export interface iAppError extends Error {
  statusCode: number;
  message: string;
  path?: string;
  customName?: string;
  stack?: string;
}

interface ValidationErrorField {
  name: string;
  message: string;
  kind: string;
  path: string;
  value?: unknown;
}

export interface iValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, ValidationErrorField>;
}

export interface iMongooseError extends Error {
  name: "MongooseError";
  message: string;
}

export interface iCastError extends Error {
  name: "CastError";
  kind: string;
  value: string;
  path: string;
  reason?: unknown;
}

import { ZodIssue } from "zod";

export interface iZodError extends Error {
  name: "ZodError";
  issues: ZodIssue[];
  errors?: string | ZodIssue[];
}

export type KnownErrors =
  | iAppError
  | iValidationError
  | iMongooseError
  | iCastError
  | iZodError;
