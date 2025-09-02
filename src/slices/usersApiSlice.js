import { LOGIN_URL, USERS_ADDRESS_URL, USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${LOGIN_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/UserRegisteration`,
        method: "POST",
        body: data,
      }),
    }),
    // logout: builder.mutation({
    //   query: () => ({
    //     url: `${USERS_URL}/logout`,
    //     method: "POST",
    //   }),
    // }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/UpdateUserDetailsByUserId`,
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: ({ Id }) => ({
        url: `${USERS_URL}/GetUserDetailsByUserId?Id=${Id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    forgotPasswordMail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/ResetPasswrodEmail`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/ResetUserPassword`,
        method: "POST",
        body: data,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),
    deleteUsers: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    updateUsers: builder.mutation({
      query: (details) => ({
        url: `${USERS_URL}/${details?.userId}`,
        body: details,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    getUserByID: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    sentRegistationEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/EmailRegistration`,
        body: data,
        method: "POST",
      }),
    }),
    sentUserRegsitrationPhone: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/VerifyPhoneNumber`,
        body: data,
        method: "POST",
      }),
    }),
    verifyUserMobileOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/VerifyPhoneNumberOTP`,
        body: data,
        method: "POST",
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/VerifyOTP`,
        body: data,
        method: "POST",
      }),
    }),
    verifyForgotOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/VerifyOTPForUserPasswordReset`,
        body: data,
        method: "POST",
      }),
    }),
    addUserAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_ADDRESS_URL}/InsertUserAddress`,
        method: "POST",
        body: data,
      }),
    }),
    getUserAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_ADDRESS_URL}/GetUserAddressbyUserID`,
        method: "POST",
        body: data,
      }),
    }),
    updateUserAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_ADDRESS_URL}/UpdateUserAddress`,
        method: "POST",
        body: data,
      }),
    }),
    deleteUserAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_ADDRESS_URL}/DeleteUserAddress`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMailMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
  useProfileMutation,
  useGetAllUsersQuery,
  useDeleteUsersMutation,
  useUpdateUsersMutation,
  useGetUserByIDQuery,
  useSentRegistationEmailMutation,
  useVerifyOtpMutation,
  useGetProfileQuery,
  useSentUserRegsitrationPhoneMutation,
  useVerifyUserMobileOtpMutation,
  useAddUserAddressMutation,
  useGetUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} = usersApiSlice;
