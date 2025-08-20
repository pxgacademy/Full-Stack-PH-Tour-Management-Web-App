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
    const filters = Object.fromEntries(
      Object.entries(this.query ?? {}).filter(([key]) => !exclude.includes(key))
    ) as FilterQuery<T>;
    return filters;
  }

  // Make getSearchQuery return searchQuery instead of setting instance property
  private getSearchQuery(searchableFields: string[]): SearchQuery | object {
    const search = this?.query?.search?.trim() || "";
    if (!search) return {}; // Return empty object if no search term

    const searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };

    return searchQuery;
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

/*

http://localhost:5000/api/v1/tours/all-tours?page=4&limit=2
http://localhost:5000/api/v1/tours/all-tours?page=5&limit=2
http://localhost:5000/api/v1/tours/all-tours?page=6&limit=2

// each time return same data
[
    {
        "_id": "b2de0b96011546ce8b7b40df",
        "title": "Lost Cities of the Ancient World",
        "slug": "lost-cities-of-the-ancient-world",
        "createdAt": "2025-07-08T09:56:45.551Z",
        "updatedAt": "2025-07-08T09:56:45.551Z"
    },
    {
        "_id": "a736c63b55ce42d599d2fe97",
        "title": "Sailing Through Serenity",
        "slug": "sailing-through-serenity",
        "createdAt": "2025-07-08T09:56:45.551Z",
        "updatedAt": "2025-07-08T09:56:45.551Z"
    }
]

// but meta is different
{
    "total_data": 30,
    "filtered_data": 30,
    "present_data": 2,
    "total_page": 15,
    "present_page": 4,
    "skip": 6,
    "limit": 2
}

{
    "total_data": 30,
    "filtered_data": 30,
    "present_data": 2,
    "total_page": 15,
    "present_page": 5,
    "skip": 8,
    "limit": 2
}

{
    "total_data": 30,
    "filtered_data": 30,
    "present_data": 2,
    "total_page": 15,
    "present_page": 6,
    "skip": 10,
    "limit": 2
}

  // redux mutation
  getTours: builder.query<iResponse<iTourResponse[]>, iTourSearchParams>({
      query: (params) => ({
        url: "/tours/all-tours",
        method: "GET",
        params,
      }),
      providesTags: ["TOUR"],
    }),

  // calling from tour page
  const { data, isLoading } = useGetToursQuery(
    { search, division, tourType, sort, page, limit },
    { refetchOnMountOrArgChange: true }
  );


আমি ফ্রন্টেন্ডে React & Redux ইউজ করছি। পেজিনেশনের সময় কিছু ক্ষেত্রে পেইজ চেঞ্জ হলেও ডুপলিকেট ডাটা রিটার্ন করছে। যেমন পেইজ 1, 2, 3 কাজ করছে, কিন্তু আবার 4, 5, 6 এগুলো কাজ করছে না। নেটওয়ার্ক ট্যাবে আলাদা রিকোয়েস্ট হচ্ছে (page=4 vs page=5 vs page=6), MongoDB তে ডেটাও ঠিকঠাক আছে, কিন্তু Response এ ডুপ্লিকেট বা একই ডেটা আসছে।


আমি তোমাকে tour.services.ts ফাইলে বেকেন্ডএর কোড দিয়েছি। চেক কর।

আমাকে মূল সমস্যা ও সমাধান জানাও।



















*/
