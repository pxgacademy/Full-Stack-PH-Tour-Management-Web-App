const fields: string[] = ["title", "description", "location"];

export const queryFilters = (search: string) => {
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    })),
  };
};
