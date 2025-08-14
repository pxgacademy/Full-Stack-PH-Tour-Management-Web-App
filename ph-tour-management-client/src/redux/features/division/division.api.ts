import { baseApi } from "@/redux/baseApi";
import type { iResponse } from "@/types";
import type { iDivisionResponse } from "@/types/division.type";

export const divisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDivision: builder.mutation<iResponse<iDivisionResponse>, FormData>({
      query: (data) => ({
        url: "/division/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["DIVISION"],
    }),

    updateDivision: builder.mutation<
      iResponse<iDivisionResponse>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/division/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["DIVISION"],
    }),

    deleteDivision: builder.mutation<iResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/division/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DIVISION"],
    }),

    getDivisions: builder.query<
      iDivisionResponse[],
      null,
      iResponse<iDivisionResponse[]>
    >({
      query: () => ({
        url: "/division/all-divisions",
        method: "GET",
      }),
      providesTags: ["DIVISION"],
      transformResponse: (res) => res.data,
    }),

    //
  }),
});

export const {
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
  useGetDivisionsQuery,
} = divisionApi;
