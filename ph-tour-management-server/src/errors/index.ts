/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import { ZodError } from "zod";

type Validation = mongoose.Error.ValidationError;

//--------------
export const zodValidationError = (err: ZodError) => {
  const zError = err.issues?.map((error: any) => ({
    path: error?.path?.join("/"),
    message: error?.message,
  }));

  return [{ name: err?.name }, ...zError];
};

//--------------
export const validationError = (err: Validation) => {
  const formattedErrors = Object.values(err?.errors || {}).map((error: any) => {
    if (error.name === "ValidatorError") {
      return {
        path: error.path,
        message: error.message,
      };
    }

    if (error.name === "CastError") {
      const expectedType = error.kind || "unknown";
      const receivedType = error.valueType || typeof error.value;
      const valueString = JSON.stringify(error.value).replace(/^"(.*)"$/, "$1");
      return {
        path: error.path || "unknown",
        message: `Field '${error.path}' must be of type ${expectedType}, but received '${valueString}' (type: ${receivedType})`,
      };
    }

    return {
      path: error.path || "unknown",
      message: error.message || "Invalid input",
    };
  });

  return [{ name: err?.name }, ...formattedErrors];
};

//--------------
export const mongooseError = (err: any) => {
  return [
    { name: err.name },
    { path: Object.keys(err?.cause?.keyValue)?.[0], message: err.message },
  ];
};

//--------------
export const castError = (err: any) => {
  return [{ name: err.name }, { path: err.path, message: err.message }];
};

//--------------
export const appError = (err: any) => {
  return [
    { name: err?.name || "Error" },
    { path: err?.path || "", message: err.message },
  ];
};

/*















        _       _       _       _       _       _       _       _       _  
       /_\     /_\     /_\     /_\     /_\     /_\     /_\     /_\     /_\ 
      /_^_\   /_^_\   /_^_\   /_^_\   /_^_\   /_^_\   /_^_\   /_^_\   /_^_\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\   /*^*\
      \\|//   \\|//   \\|//   \\|//   \\|//   \\|//   \\|//   \\|//   \\|//   

























/* export const validationError = (err: any) => {
  const vError = Object.values(err?.errors).map((error: any) => ({
    path: error.path,
    message: error.message,
  }));

  return [{ name: err?.name }, ...vError];


      /*if (error.name === "ValidatorError") {
      let message = error.message || "Invalid value";

      // improve common patterns
      message = message
        .replace(
          /^Path `(\w+)` is required\.$/,
          (_, field) => `${field} is required`
        )
        .replace(
          /^Path `(\w+)` \(`(.+)`\) is shorter than the minimum allowed length \((\d+)\)\.$/,
          (_, field, value, limit) =>
            `${field} must be at least ${limit} characters long`
        )
        .replace(
          /^Path `(\w+)` \(`(.+)`\) is longer than the maximum allowed length \((\d+)\)\.$/,
          (_, field, value, limit) =>
            `${field} must be at most ${limit} characters long`
        )
        .replace(
          /^Path `(\w+)` is invalid \(.*\)\.$/,
          (_, field) => `${field} is not valid`
        );

      return {
        path: error.path,
        message,
      };
    }
};*/
