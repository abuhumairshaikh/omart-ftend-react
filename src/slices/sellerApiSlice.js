import { LOGIN_URL, SELLER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const sellerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${LOGIN_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    registerSeller: builder.mutation({
      query: (data) => ({
        url: `${SELLER_URL}/SellerRegestration`,
        method: "POST",
        body: data,
      }),
    }),
    sellerProfile: builder.query({
      query: ({ sellerId }) => ({
        url: `${SELLER_URL}/GetsellerDetailsBySellerId?sellerId=${sellerId}`,
      }),
    }),
    forgotSellerPasswordMail: builder.mutation({
      query: (data) => ({
        url: `${SELLER_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),
    resetSellerPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: `${SELLER_URL}/reset-password?token=${token}`,
        method: "POST",
        body: data,
      }),
    }),
    updateSellerUser: builder.mutation({
      query: (details) => ({
        url: `${SELLER_URL}/UpdateSellerDetailsBySellerId`,
        body: details,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getUserByID: builder.query({
      query: (userId) => ({
        url: `${SELLER_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    sentSellerRegistationEmail: builder.mutation({
      query: (data) => ({
        url: `${SELLER_URL}/SellerLoginEmail`,
        body: data,
        method: "POST",
      }),
    }),
    verifySellerOtp: builder.mutation({
      query: (data) => ({
        url: `${SELLER_URL}/VerifyOtpForSellerEmail`,
        body: data,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSentSellerRegistationEmailMutation,
  useRegisterSellerMutation,
  useVerifySellerOtpMutation,
  useSellerProfileQuery,
  useUpdateSellerUserMutation,
} = sellerApiSlice;
