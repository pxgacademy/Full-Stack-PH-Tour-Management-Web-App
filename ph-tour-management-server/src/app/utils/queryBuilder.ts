import { Document, FilterQuery, Model, Query } from "mongoose";

type RecordType = Record<string, string | undefined>;
interface SearchQuery {
  $or: Record<string, { $regex: string; $options: "i" }>[];
}

export class QueryBuilder<T extends Document> {
  public rawModel: Model<T>;
  public model: Query<T[], T>;
  public readonly query: RecordType;

  private searchQuery: SearchQuery | object = {};
  private filters: FilterQuery<T> = {};

  constructor(rawModel: Model<T>, query: RecordType) {
    this.rawModel = rawModel;
    this.model = this.rawModel.find();
    this.query = query;
  }

  getFilters() {
    const exclude = ["search", "sort", "fields", "page", "limit"];
    this.filters = Object.fromEntries(
      Object.entries(this.query ?? {}).filter(([key]) => !exclude.includes(key))
    ) as FilterQuery<T>;
  }

  getSearchQuery(searchableFields: string[]) {
    const search = this?.query?.search?.trim() || "";
    this.searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
  }

  filter(): this {
    this.getFilters();
    this.model = this.model.find(this.filters);
    return this;
  }

  search(searchableFields: string[]): this {
    this.getSearchQuery(searchableFields);
    this.model = this.model.find(this.searchQuery);
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

  async meta(searchableFields: string[], filtered_data: number) {
    this.getSearchQuery(searchableFields);
    this.getFilters();

    const filterQuery = {
      ...this.searchQuery,
      ...this.filters,
    } as FilterQuery<T>;

    const pageNum = Math.max(Number(this.query?.page) || 1, 1);
    const limitNum = Math.max(Number(this.query?.limit) || 12, 1);
    const skip = (pageNum - 1) * limitNum;

    const [filteredCount, totalDataCount] = await Promise.all([
      this.rawModel.countDocuments(filterQuery),
      this.rawModel.estimatedDocumentCount(),
    ]);

    return {
      total_data: totalDataCount,
      filtered_data,
      total_page: Math.ceil(filteredCount / limitNum),
      present_page: pageNum,
      skip,
      limit: limitNum,
    };
  }

  build() {
    return this.model;
  }
}
