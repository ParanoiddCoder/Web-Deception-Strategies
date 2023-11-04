import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({  //mutation for post request
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
              url: `${USERS_URL}`,
              method: 'POST',
              body: data,
            }),
          }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
    }),
});

// console.log(productsApiSlice);
export const { useLoginMutation,useLogoutMutation,useRegisterMutation } = userApiSlice;
