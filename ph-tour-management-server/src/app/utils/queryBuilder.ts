import { Query } from "mongoose";

type RecordType = Record<string, string | undefined>;

export class QueryBuilder<T> {
  public model: Query<T[], T>;
  public readonly query: RecordType;

  constructor(model: Query<T[], T>, query: RecordType) {
    this.model = model;
    this.query = query;
  }

  filter(): this {
    const excludeKeys = ["search", "sort", "fields", "page", "limit"];

    const filters = Object.fromEntries(
      Object.entries(this.query).filter(([key]) => !excludeKeys.includes(key))
    );

    this.model = this.model.find(filters);

    return this;
  }

  search(searchableFields: string[]): this {
    const search = this?.query?.search?.trim() || "";

    const searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };

    this.model = this.model.find(searchQuery);

    return this;
  }

  sort(): this {
    const sort = this.query?.sort || "-createdAt";
    this.model = this.model.sort(sort);

    return this;
  }

  select(): this {
    const fields = this.query?.fields?.split(",").join(" ") || "";
    this.model = this.model.select(fields);

    return this;
  }

  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 12;
    const skip = (page - 1) * limit;

    this.model = this.model.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.model;
  }
}
