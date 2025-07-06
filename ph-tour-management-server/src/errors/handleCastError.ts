//

export const handleCastError = (err: any) => {
  return {
    statusCode: 400,
    message: "Invalid ID",
    errorMessages: [
      {
        path: err.path,
        message: `Invalid ${err.path}: ${err.value}`,
      },
    ],
  };
};
