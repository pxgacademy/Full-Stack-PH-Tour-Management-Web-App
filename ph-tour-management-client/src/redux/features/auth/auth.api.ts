import { baseApi } from "@/redux/baseApi";
import type { iResponse, iSendOtp } from "@/types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        data,
      }),
    }),

    sendOtp: builder.mutation<iResponse<null>, iSendOtp>({
      query: (data) => ({
        url: "/otp/send",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useSendOtpMutation } =
  authApi;
