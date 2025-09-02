import { GET_SELLER_PRODUCT_URL, PRODUCTS_URL, SELLER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByName: builder.query({
      query: (search) => ({
        url: `${PRODUCTS_URL}/search`, // Add the specific endpoint
        method: "POST", // Specify POST method
        body: search, // Send the entityID in the request body
      }),
      // keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getSellerProducts: builder.query({
      query: ({ entityID }) => ({
        url: `${GET_SELLER_PRODUCT_URL}/GetAllProductsbySellers`, // Add the specific endpoint
        method: "POST", // Specify POST method
        body: { entityID }, // Send the entityID in the request body
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Seller"],
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/GetAllCategories`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${GET_SELLER_PRODUCT_URL}/AddProducts`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    getSearchedProducts: builder.mutation({
      query: ({ categories = "", searchText = "" }) => ({
        url: `${PRODUCTS_URL}/SearchFilters`,
        method: "POST",
        body: { categories, searchText },
      }),
      keepUnusedDataFor: 5,
    }),
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/getProductDeatils/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: `${GET_SELLER_PRODUCT_URL}/Delete/${productId}`,
        method: "DELETE",
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${SELLER_URL}/UpdateProduct`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/UploadProductImages`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProductImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/RemoveImages`,
        method: "DELETE",
        body: data,
      }),
    }),
    createProductReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data?.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProductCoverImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/UpdateCoverImage`,
        method: "POST",
        body: data,
      }),
    }),
    getTopProduct: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/GetProductImages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useDeleteProductByIdMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useCreateProductReviewMutation,
  useGetTopProductQuery,
  useGetSellerProductsQuery,
  useCreateProductMutation,
  useGetAllCategoryQuery,
  useGetProductsByNameQuery,
  useLazyGetProductsByNameQuery,
  useGetProductImageMutation,
  useGetSearchedProductsMutation,
  useDeleteProductImageMutation,
  useUpdateProductCoverImageMutation,
} = productApiSlice;
