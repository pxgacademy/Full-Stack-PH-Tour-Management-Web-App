export interface iGlobalResponse {
  createdAt: Date;
  updatedAt: Date;
}

export interface iReqQueryParams {
  search?: string;
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
  [key: string]: string | undefined;
}

// Omit<iBooking, '_id'> & { _id: string }
