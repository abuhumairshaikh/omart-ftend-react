import { apiSlice } from "./apiSlice";
import { CART_URL, PAYPAL_URL } from "../constants";

export const token = localStorage.getItem("token");

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCartApi: builder.mutation({
      query: (cart) => ({
        url: `${CART_URL}/AddToCart`,
        method: "POST",
        body: { ...cart },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    updateCartQuantity: builder.mutation({
      query: (cart) => ({
        url: `${CART_URL}/updateProductQuantity`,
        method: "PUT",
        body: { ...cart },
      }),
    }),
    deleteCartQuantity: builder.mutation({
      query: (cart) => ({
        url: `${CART_URL}/removeFromCart`,
        method: "DELETE",
        body: { ...cart },
      }),
    }),
    getCartByUserId: builder.query({
      query: (user_id) => ({
        url: `${CART_URL}/GetCartData/${user_id}`,
      }),
      transformResponse: (response) => response || [],
      providesTags: (result, error, user_id) => [{ type: "Cart", id: user_id }],
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${CART_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${CART_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: `${PAYPAL_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${CART_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useAddToCartApiMutation,
  useGetCartByUserIdQuery,
  useUpdateCartQuantityMutation,
  useDeleteCartQuantityMutation,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = orderApiSlice;
