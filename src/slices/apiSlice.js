import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const tokenStored = JSON.parse(localStorage.getItem("token"));
    if (tokenStored?.token) {
      headers.set("Authorization", `Bearer ${tokenStored.token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    // Unauthorized error, attempt to refresh the token
    const tokenStored = JSON.parse(localStorage.getItem("token"));
    const { token, refreshToken } = tokenStored || {};

    if (refreshToken) {
      // Attempt to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "/api/Account/refreshAuth",
          method: "POST",
          body: { token, refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        // Save the new token in localStorage
        localStorage.setItem("token", JSON.stringify(refreshResult.data));

        // Retry the original request with the new token
        result = await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${refreshResult.data.token}`,
            },
          },
          api,
          extraOptions
        );
      } else {
        // Refresh token failed, log out the user
        localStorage.removeItem("token");
        api.dispatch({ type: "auth/logout" }); // Update this based on your auth slice
      }
    } else {
      // No refresh token, log out the user
      localStorage.removeItem("token");
      api.dispatch({ type: "auth/logout" }); // Update this based on your auth slice
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Order", "User", "Seller", "BookMark"],
  endpoints: (builder) => ({}),
});
