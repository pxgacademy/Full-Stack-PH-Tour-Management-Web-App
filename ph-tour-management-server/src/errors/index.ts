/* eslint-disable @typescript-eslint/no-explicit-any */

export const zodValidationError = (err: any) => {
  const zError = err.errors?.map((error: any) => ({
    path: error?.path?.[0],
    message: error?.message,
  }));

  return [{ name: err?.name }, ...zError];
};

export const validationError = (err: any) => {
  const vError = Object.values(err?.errors).map((error: any) => ({
    path: error.path,
    message: error.message,
  }));

  return [{ name: err?.name }, ...vError];
};

export const mongooseError = (err: any) => {
  return [
    { name: err.name },
    { path: Object.keys(err?.cause?.keyValue)?.[0], message: err.message },
  ];
};

export const castError = (err: any) => {
  return [{ name: err.name }, { path: err.path, message: err.message }];
};

export const appError = (err: any) => {
  return [
    { name: err?.name || "Error" },
    { path: err?.path || "", message: err.message },
  ];
};
