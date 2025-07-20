export const tourSearchFields: string[] = ["title", "description", "location"];

export const buildSearchQuery = (search: string) => {
  if (!search.trim()) return {};

  return {
    $or: tourSearchFields.map((field) => ({
      [field]: { $regex: search.trim(), $options: "i" },
    })),
  };
};
