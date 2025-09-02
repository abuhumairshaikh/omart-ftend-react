import { apiSlice } from "./apiSlice";
import { BOOKMARKS_URL } from "../constants";

export const bookmarksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBookmark: builder.mutation({
      query: (body) => ({
        url: `${BOOKMARKS_URL}/insertBookmark`,
        method: "POST",
        body,
      }),
    }),
    getBookMarksById: builder.query({
      query: (user_id) => ({
        url: `${BOOKMARKS_URL}/GetBookmarksByUserId/${user_id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    deleteBookmark: builder.mutation({
      query: (bookmarkID) => ({
        url: `${BOOKMARKS_URL}/deleteBookmark/${bookmarkID}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateBookmarkMutation,
  useGetBookMarksByIdQuery,
  useDeleteBookmarkMutation,
} = bookmarksApiSlice;
