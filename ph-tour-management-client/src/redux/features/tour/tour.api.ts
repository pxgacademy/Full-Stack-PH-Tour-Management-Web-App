import { baseApi } from "@/redux/baseApi";
import type {
  iResponse,
  iTourType,
  iTourTypeResponse,
  iUpdateTourType,
} from "@/types";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTourType: builder.mutation<iResponse<iTourTypeResponse>, iTourType>({
      query: (data) => ({
        url: "/tours/create-tour-type",
        method: "POST",
        data,
      }),
      invalidatesTags: ["TOUR_TYPE"],
    }),

    updateTourType: builder.mutation<iResponse<iTourType>, iUpdateTourType>({
      query: ({ id, name }) => ({
        url: `/tours/tour-type/${id}`,
        method: "PATCH",
        data: { name },
      }),
      invalidatesTags: ["TOUR_TYPE"],
    }),

    deleteTourType: builder.mutation<iResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/tours/tour-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TOUR_TYPE"],
    }),

    tourTypes: builder.query<
      iTourTypeResponse[],
      null,
      iResponse<iTourTypeResponse[]>
    >({
      query: () => ({
        url: "/tours/all-tour-types",
        method: "GET",
      }),
      providesTags: ["TOUR_TYPE"],
      transformResponse: (res) => res.data,
    }),

    //
  }),
});

export const {
  useCreateTourTypeMutation,
  useDeleteTourTypeMutation,
  useUpdateTourTypeMutation,
  useTourTypesQuery,
} = tourApi;

/*
  RTK Query builder.query generic
  builder.query<FinalResultType, QueryArgType, BaseQueryResponseType>
*/
