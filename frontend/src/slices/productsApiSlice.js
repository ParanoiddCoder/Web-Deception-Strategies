import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";
import { UPLOADS_URL } from "../constants";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5,
            // provides : ['Products'],
        }),
        getProductDetails: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags : ['Product'],
        }), 
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOADS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

// console.log(productsApiSlice);
export const { useGetProductsQuery,useGetProductDetailsQuery,useCreateProductMutation, useUpdateProductMutation ,useUploadProductImageMutation , useDeleteProductMutation} = productsApiSlice;
