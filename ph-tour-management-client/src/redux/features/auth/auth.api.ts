import { baseApi } from "@/redux/baseApi";
import type {
  iLogin,
  iResponse,
  iSendOtp,
  iUserInfo,
  iVerifyOtp,
} from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<iResponse<iUserInfo>, iLogin>({
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

    logout: builder.mutation<iResponse<null>, null>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    sendOtp: builder.mutation<iResponse<null>, iSendOtp>({
      query: (data) => ({
        url: "/otp/send",
        method: "POST",
        data,
      }),
    }),

    verifyOtp: builder.mutation<iResponse<null>, iVerifyOtp>({
      query: (data) => ({
        url: "/otp/verify",
        method: "POST",
        data,
      }),
    }),

    myInfo: builder.query<iResponse<iUserInfo>, null>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useMyInfoQuery,
} = authApi;
