/*

// query builder
import { Document, FilterQuery, Model, Query } from "mongoose";

type sortParams = Record<string, 1 | -1>;

type RecordType = Record<string, string | undefined>;
interface SearchQuery {
  $or: Record<string, { $regex: string; $options: "i" }>[];
}

export class QueryBuilder<T extends Document> {
  public rawModel: Model<T>;
  public model: Query<T[], T>;
  public readonly query: RecordType;

  constructor(rawModel: Model<T>, query: RecordType) {
    this.rawModel = rawModel;
    this.model = this.rawModel.find(); // Fresh query instance
    this.query = query;
  }

  // Make getFilters return filters instead of setting instance property
  private getFilters(): FilterQuery<T> {
    const exclude = ["search", "sort", "fields", "page", "limit"];
    return Object.fromEntries(
      Object.entries(this.query ?? {}).filter(([key]) => !exclude.includes(key))
    ) as FilterQuery<T>;
  }

  // Make getSearchQuery return searchQuery instead of setting instance property
  private getSearchQuery(searchableFields: string[]): SearchQuery | object {
    const search = this?.query?.search?.trim() || "";
    if (!search) return {}; // Return empty object if no search term
    
    return {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
  }

  filter(): this {
    const filters = this.getFilters();
    this.model = this.model.find(filters);
    return this;
  }

  search(searchableFields: string[]): this {
    const searchQuery = this.getSearchQuery(searchableFields);
    if (Object.keys(searchQuery).length > 0) {
      this.model = this.model.find(searchQuery);
    }
    return this;
  }

  sort(): this {
    const sort = this.query?.sort || "-createdAt";
    const sortOption: sortParams = {};

    if (sort.startsWith("-")) {
      // Add _id as secondary sort for stable sorting
      sortOption[sort.substring(1)] = -1;
      sortOption["_id"] = -1; 
    } else {
      sortOption[sort] = 1;
      sortOption["_id"] = 1; 
    }

    this.model = this.model.sort(sortOption);

    return this;
  }

  select(): this {
    const fields = this.query?.fields?.split(",").join(" ") || "";
    if (fields) {
      this.model = this.model.select(fields);
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.model = this.model.skip(skip).limit(limit);

    return this;
  }

  async meta(searchableFields: string[]) {
    const searchQuery = this.getSearchQuery(searchableFields);
    const filters = this.getFilters();

    const filterQuery = {
      ...searchQuery,
      ...filters,
    } as FilterQuery<T>;

    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limit = Math.max(Number(this.query?.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const [filteredCount, totalDataCount] = await Promise.all([
      this.rawModel.countDocuments(filterQuery),
      this.rawModel.estimatedDocumentCount(),
    ]);

    const ls = limit + skip;

    return {
      total_data: totalDataCount,
      filtered_data: filteredCount,
      present_data: filteredCount > ls ? limit : filteredCount - skip,
      total_page: Math.ceil(filteredCount / limit),
      present_page: page,
      skip,
      limit: limit,
    };
  }

  build() {
    return this.model;
  }
}

// Alternative Solution: Reset method for reusing same instance
export class QueryBuilderWithReset<T extends Document> {
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

  // Reset method to clear previous state
  reset(): this {
    this.model = this.rawModel.find(); // Fresh query instance
    this.searchQuery = {};
    this.filters = {};
    return this;
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

    const sortOption: sortParams = {};

    if (sort.startsWith("-")) sortOption[sort.substring(1)] = -1;
    else sortOption[sort] = 1;

    this.model = this.model.sort(sortOption);

    return this;
  }

  select(): this {
    const fields = this.query?.fields?.split(",").join(" ") || "";
    this.model = this.model.select(fields);

    return this;
  }

  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.model = this.model.skip(skip).limit(limit);

    return this;
  }

  async meta(searchableFields: string[]) {
    this.getSearchQuery(searchableFields);
    this.getFilters();

    const filterQuery = {
      ...this.searchQuery,
      ...this.filters,
    } as FilterQuery<T>;

    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limit = Math.max(Number(this.query?.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const [filteredCount, totalDataCount] = await Promise.all([
      this.rawModel.countDocuments(filterQuery),
      this.rawModel.estimatedDocumentCount(),
    ]);

    const ls = limit + skip;

    return {
      total_data: totalDataCount,
      filtered_data: filteredCount,
      present_data: filteredCount > ls ? limit : filteredCount - skip,
      total_page: Math.ceil(filteredCount / limit),
      present_page: page,
      skip,
      limit: limit,
    };
  }

  build() {
    return this.model;
  }
}

// tour service - Updated
import { Tour } from "./tour.model";

interface iReqQueryParams {
  search?: string;
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
  [key: string]: string | undefined;
}

export const tourSearchFields: string[] = ["title", "description", "location"];

// Backend debugging - Add this to your QueryBuilder
export class QueryBuilderDebug<T extends Document> {
  public rawModel: Model<T>;
  public model: Query<T[], T>;
  public readonly query: RecordType;

  constructor(rawModel: Model<T>, query: RecordType) {
    this.rawModel = rawModel;
    this.model = this.rawModel.find();
    this.query = query;
    console.log('🔥 New QueryBuilder instance created with query:', query);
  }

  private getFilters(): FilterQuery<T> {
    const exclude = ["search", "sort", "fields", "page", "limit"];
    const filters = Object.fromEntries(
      Object.entries(this.query ?? {}).filter(([key]) => !exclude.includes(key))
    ) as FilterQuery<T>;
    console.log('📋 Filters:', filters);
    return filters;
  }

  private getSearchQuery(searchableFields: string[]): SearchQuery | object {
    const search = this?.query?.search?.trim() || "";
    if (!search) {
      console.log('🔍 No search term');
      return {};
    }
    
    const searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
    console.log('🔍 Search Query:', JSON.stringify(searchQuery));
    return searchQuery;
  }

  filter(): this {
    const filters = this.getFilters();
    this.model = this.model.find(filters);
    console.log('✅ Filter applied');
    return this;
  }

  search(searchableFields: string[]): this {
    const searchQuery = this.getSearchQuery(searchableFields);
    if (Object.keys(searchQuery).length > 0) {
      this.model = this.model.find(searchQuery);
      console.log('✅ Search applied');
    }
    return this;
  }

  sort(): this {
    const sort = this.query?.sort || "-createdAt";
    const sortOption: sortParams = {};

    if (sort.startsWith("-")) {
      // Add _id as secondary sort for stable sorting
      sortOption[sort.substring(1)] = -1;
      sortOption["_id"] = -1; // Secondary sort by _id for stable pagination
    } else {
      sortOption[sort] = 1;
      sortOption["_id"] = 1; // Secondary sort by _id for stable pagination
    }

    this.model = this.model.sort(sortOption);
    console.log('✅ Sort applied:', sortOption);
    return this;
  }

  select(): this {
    const fields = this.query?.fields?.split(",").join(" ") || "";
    if (fields) {
      this.model = this.model.select(fields);
      console.log('✅ Select applied:', fields);
    }
    return this;
  }

  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('📄 Pagination - Page:', page, 'Limit:', limit, 'Skip:', skip);
    this.model = this.model.skip(skip).limit(limit);
    console.log('✅ Pagination applied');
    return this;
  }

  async build() {
    // Log the final query before execution
    console.log('🚀 Final Query:', this.model.getQuery());
    console.log('🚀 Query Options:', this.model.getOptions());
    
    const result = await this.model.exec();
    console.log('📊 Results count:', result.length);
    console.log('📊 First result ID:', result[0]?._id);
    
    return result;
  }

  async meta(searchableFields: string[]) {
    const searchQuery = this.getSearchQuery(searchableFields);
    const filters = this.getFilters();

    const filterQuery = {
      ...searchQuery,
      ...filters,
    } as FilterQuery<T>;

    console.log('📊 Meta filter query:', JSON.stringify(filterQuery));

    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limit = Math.max(Number(this.query?.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const [filteredCount, totalDataCount] = await Promise.all([
      this.rawModel.countDocuments(filterQuery),
      this.rawModel.estimatedDocumentCount(),
    ]);

    const ls = limit + skip;
    const meta = {
      total_data: totalDataCount,
      filtered_data: filteredCount,
      present_data: filteredCount > ls ? limit : filteredCount - skip,
      total_page: Math.ceil(filteredCount / limit),
      present_page: page,
      skip,
      limit: limit,
    };

    console.log('📊 Meta result:', meta);
    return meta;
  }
}

// Use debug version temporarily
export const getAllToursServiceWithDebug = async (query: iReqQueryParams) => {
  console.log('🏁 Service called with query:', query);
  const queryBuilder = new QueryBuilderDebug(Tour, query);

  const [tours, meta] = await Promise.all([
    queryBuilder.search(tourSearchFields).filter().sort().select().paginate().build(),
    queryBuilder.meta(tourSearchFields),
  ]);

  return {
    data: tours,
    meta,
  };
};


*/
