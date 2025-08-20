import { baseApi } from "@/redux/baseApi";
import type { iBooking, iBookingResponse, iResponse } from "@/types";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //
    createBooking: builder.mutation<iResponse<iBookingResponse>, iBooking>({
      query: (data) => ({
        url: "/bookings/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["BOOKING"],
    }),

    //
  }),
});

export const { useCreateBookingMutation } = bookingApi;

/*
  RTK Query builder.query generic
  builder.query<FinalResultType, QueryArgType, BaseQueryResponseType>
*/
