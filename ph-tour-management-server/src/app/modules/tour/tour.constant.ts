const fields: string[] = ["title", "description", "location"];

export const buildSearchQuery = (search: string) => {
  if (!search.trim()) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: search.trim(), $options: "i" },
    })),
  };
};
