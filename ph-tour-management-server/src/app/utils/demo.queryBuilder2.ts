/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Model, Query } from "mongoose";

type RecordType = Record<string, string | undefined>;

export class QueryBuilder<T extends Document> {
  private model: Model<T>;
  private query: Query<T[], T>;
  private queryParams: RecordType;
  private populateFields: string[] = [];

  // meta values
  private totalDataCount = 0;
  private filteredDataCount = 0;
  private skip = 0;
  private limit = 10;
  private page = 1;

  constructor(model: Model<T>, queryParams: RecordType) {
    this.model = model;
    this.queryParams = queryParams;
    this.query = this.model.find();
  }

  search(searchFields: string[]) {
    const search = this.queryParams?.search?.trim() || "";
    if (search) {
      this.query = this.query.find({
        $or: searchFields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })),
      });
    }
    return this;
  }

  filter() {
    const exclude = ["search", "sort", "fields", "page", "limit"];
    const filters = Object.entries(this.queryParams).reduce(
      (acc, [key, value]) => {
        if (!exclude.includes(key) && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as RecordType
    );

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    const sort = this.queryParams.sort || "-createdAt";
    this.query = this.query.sort(sort);
    return this;
  }

  select() {
    const fields = this.queryParams.fields;
    if (fields) {
      const fieldsStr = fields.split(",").join(" ");
      this.query = this.query.select(fieldsStr);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    this.page = Math.max(Number(this.queryParams.page) || 1, 1);
    this.limit = Math.max(Number(this.queryParams.limit) || 12, 1);
    this.skip = (this.page - 1) * this.limit;

    this.query = this.query.skip(this.skip).limit(this.limit);
    return this;
  }

  populate(fields: string | string[]) {
    const populateList = Array.isArray(fields) ? fields : fields?.split(/\s+/);
    this.populateFields.push(...populateList);
    return this;
  }

  async exec() {
    // Total count without filter
    this.totalDataCount = await this.model.countDocuments();

    // Create filteredQuery to count filtered data (search + filter)
    const filteredQuery = this.model.find();

    const searchTerm = this.queryParams.search?.trim() || "";
    if (searchTerm) {
      // Try to reuse same $or from original query

      const searchFields =
        (this.query as any)._conditions?.$or?.map(
          (cond: unknown) => Object.keys(cond as object)[0]
        ) || [];

      if (searchFields.length > 0) {
        filteredQuery.find({
          $or: searchFields.map((field: string) => ({
            [field]: { $regex: searchTerm, $options: "i" },
          })),
        });
      }
    }

    const exclude = ["search", "sort", "fields", "page", "limit"];
    const filters = Object.entries(this.queryParams).reduce(
      (acc, [key, value]) => {
        if (!exclude.includes(key) && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as RecordType
    );
    filteredQuery.find(filters);

    this.filteredDataCount = await filteredQuery.countDocuments();

    // Apply populate
    let finalQuery = this.query;
    this.populateFields.forEach((field) => {
      finalQuery = finalQuery.populate(field);
    });

    const results = await finalQuery;

    return {
      data: results,
      meta: {
        total_data: this.totalDataCount,
        filtered_data: results.length,
        total_page: Math.ceil(this.filteredDataCount / this.limit),
        present_page: this.page,
        skip: this.skip,
        limit: this.limit,
      },
    };
  }
}

/*
const builder = new QueryBuilder(TourModel, queryParams);
const result = await builder
  .search(["title", "location"])
  .filter()
  .sort()
  .select()
  .paginate()
  .populate("guide category")
  .exec();

*/

/*
//* final chaining example
await TourModel.find({
  $or: [
    { title: { $regex: "cox", $options: "i" } },
    { location: { $regex: "cox", $options: "i" } },
  ],
  status: "published",
})
  .sort({ price: -1 })
  .select("title price")
  .skip(5)
  .limit(5)
  .populate("guide")
  .populate("category")
 
*/
