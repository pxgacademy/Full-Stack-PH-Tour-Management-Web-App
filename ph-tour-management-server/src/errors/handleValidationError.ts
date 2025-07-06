//

export const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => ({
    path: el.path,
    message: el.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages: errors,
  };
};
