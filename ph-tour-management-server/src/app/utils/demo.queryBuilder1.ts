import { FilterQuery, Model } from "mongoose";

type RecordType = Record<string, string | undefined>;

interface SearchQuery {
  $or: Record<string, { $regex: string; $options: "i" }>[];
}

export class QueryBuilder<T extends Document> {
  private readonly model: Model<T>;
  private readonly query: RecordType;

  private searchQuery: SearchQuery | object = {};
  private filters: FilterQuery<T> = {};
  private sortBy = "-createdAt";
  private selectedFields = "";
  private page = 1;
  private limit = 12;
  private skip = 0;

  constructor(model: Model<T>, query: RecordType) {
    this.model = model;
    this.query = query;
  }

  public search(fields: string[]): this {
    const search = this.query.search?.trim() || "";
    if (search) {
      this.searchQuery = {
        $or: fields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })),
      };
    }
    return this;
  }

  public filter(): this {
    const exclude = ["search", "sort", "fields", "page", "limit"];
    this.filters = Object.entries(this.query).reduce(
      (acc, [key, value]) => {
        if (!exclude.includes(key) && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
    return this;
  }

  public sort(): this {
    if (this.query.sort) {
      this.sortBy = this.query.sort;
    }
    return this;
  }

  public select(): this {
    if (this.query.fields) {
      this.selectedFields = this.query.fields.split(",").join(" ");
    }
    return this;
  }

  public paginate(): this {
    this.page = Math.max(Number(this.query.page) || 1, 1);
    this.limit = Math.max(Number(this.query.limit) || 10, 1);
    this.skip = (this.page - 1) * this.limit;
    return this;
  }

  public async exec() {
    const filterQuery = {
      ...this.searchQuery,
      ...this.filters,
    };

    const [data, filteredCount, totalCount] = await Promise.all([
      this.model
        .find(filterQuery)
        .sort(this.sortBy)
        .select(this.selectedFields)
        .skip(this.skip)
        .limit(this.limit),
      this.model.countDocuments(filterQuery),
      this.model.estimatedDocumentCount(),
    ]);

    return {
      data,
      meta: {
        total_data: totalCount,
        filtered_data: filteredCount,
        total_page: Math.ceil(filteredCount / this.limit),
        present_page: this.page,
        skip: this.skip,
        limit: this.limit,
      },
    };
  }
}

/*
  const queryBuilder = new QueryBuilder(Tour, req.query);
  const result = await queryBuilder
    .search(["title", "location", "description"])
    .filter()
    .sort()
    .select()
    .paginate()
    .exec();

  return result

*/

/*
 * Final chaining example

Tour.find({
  $or: [
    { title: { $regex: "cox", $options: "i" } },
    { location: { $regex: "cox", $options: "i" } },
    { description: { $regex: "cox", $options: "i" } }
  ],
  price: "1000",          
  category: "adventure"   
})
  .sort("-createdAt")     
  .select("title price")  
  .skip(10)               
  .limit(10);             

*/
