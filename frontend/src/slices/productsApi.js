import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        getProductsDetails: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
        })
    }),
});

// console.log(productsApiSlice);
export const { useGetProductsQuery,useGetProductsDetailsQuery } = productsApiSlice;
