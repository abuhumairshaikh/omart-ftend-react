import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";
import { token } from "./cartApiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}/AddOrder`,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrderBySellerId: builder.mutation({
      query: (entity_id) => ({
        url: `${ORDERS_URL}/GetOrderBySellerId`,
        method: "POST",
        body: { ...entity_id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    getOrderByIdForSeller: builder.mutation({
      query: (orderID) => ({
        url: `${ORDERS_URL}/GetOrderList`,
        method: "POST",
        body: { ...orderID },
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: ({ userId }) => ({
        url: `${ORDERS_URL}/GetOrderwithItemsbyUserID`,
        method: "POST",
        body: { user_id: userId },
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrderByOrderId: builder.query({
      query: ({ order_id }) => ({
        url: `${ORDERS_URL}/GetOrderList`,
        method: "POST",
        body: { orderID: order_id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: `${PAYPAL_URL}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetOrderByIdQuery,
  useGetMyOrderByOrderIdQuery,
  useCreateOrderMutation,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useGetOrderBySellerIdMutation,
  useGetOrderByIdForSellerMutation,
} = orderApiSlice;
