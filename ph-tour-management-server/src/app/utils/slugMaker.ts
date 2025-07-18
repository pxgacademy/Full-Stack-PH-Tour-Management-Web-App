//
// export const slugMaker = (...rest: string[]): string =>
//   rest.join(" ").trim().toLowerCase().split(/\s+/).join("-");

import { Model } from "mongoose";

export const slugMaker = async <T>(
  model: Model<T>,
  ...rest: string[]
): Promise<string> => {
  let slug: string = rest.join(" ").trim().toLowerCase().split(/\s+/).join("-");
  let count = 0;

  while (await model.exists({ slug })) {
    slug = `${slug}-${++count}`;
  }

  return slug;
};
