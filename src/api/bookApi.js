import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getBook: builder.query({
            query: (id) => `book/${id}/`,
        }),
        getBooks: builder.query({
            query: ({ page, size } = {}) => {
                let url = 'book/';
                const params = [];
                if (page !== undefined) {
                    params.push(`page=${page}`);
                }
                if (size !== undefined) {
                    params.push(`size=${size}`);
                }
                if (params.length > 0) {
                    url += `?${params.join('&')}`;
                }
                return url;
            },
        }),
        createBook: builder.mutation({
            query: (newBook) => ({
                url: 'book/',
                method: 'POST',
                body: newBook,
            }),
        }),
        updateBook: builder.mutation({
            query: ({ id, ...update }) => ({
                url: `book/${id}/`,
                method: 'PUT',
                body: update,
            }),
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `book/${id}/`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetBookQuery,
    useGetBooksQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} = bookApi;
