import { baseApi } from "@/redux/baseApi";
import type { iResponse, iTourType } from "@/types";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTourType: builder.mutation<iResponse<iTourType>, { name: string }>({
      query: (data) => ({
        url: "/tours/create-tour-type",
        method: "POST",
        data,
      }),
      invalidatesTags: ["TOUR_TYPE"],
    }),

    tourTypes: builder.query<iTourType[], null, iResponse<iTourType[]>>({
      query: () => ({
        url: "/tours/all-tour-types",
        method: "GET",
      }),
      providesTags: ["TOUR_TYPE"],
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useCreateTourTypeMutation, useTourTypesQuery } = tourApi;

/*
  RTK Query builder.query generic
  builder.query<FinalResultType, QueryArgType, BaseQueryResponseType>
*/
