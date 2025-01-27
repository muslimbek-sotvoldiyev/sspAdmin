import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// https://staffflow.pythonanywhere.com/swagger/
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://staffflow.pythonanywhere.com/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      let parsedToken;
      try {
        parsedToken = JSON.parse(token);
      } catch (e) {
        console.error('Invalid token in localStorage:', e);
      }

      if (parsedToken?.access) {
        headers.set('Authorization', `Bearer ${parsedToken.access}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ phone_number, password }) => ({
        url: '/token/',
        method: 'POST',
        body: { phone_number, password },
      }),
    }),

    tokenVerify: builder.mutation({
      query: (token) => ({
        url: '/token/verify/',
        method: 'POST',
        body: { token },
      }),
    }),
    refreshToken: builder.mutation({
      query: (refresh) => ({
        url: '/token/refresh/',
        method: 'POST',
        body: { refresh },
      }),
    }),

    getEmployees: builder.query({
      query: ({ page = 1, page_size = 10 }) => `employees/?page=${page}&page_size=${page_size}`,
    }),

    getEmployeeId: builder.query({
      query: ({ id }) => `employees/${id}/`,
    }),

    getEmployesInRequestsPerformer: builder.query({
      query: ({ page = 1, page_size = 10, uploader, performer }) =>
        `/requests?performer=${performer}&page=${page}&page_size=${page_size}`,
    }),

    getEmployesInRequestsUploader: builder.query({
      query: ({ page = 1, page_size = 10, uploader }) =>
        `/requests?uploader=${uploader}&page=${page}&page_size=${page_size}`,
    }),

    getRequests: builder.query({
      query: ({ page = 1, page_size = 10 }) => `/requests/?page=${page}&page_size=${page_size}`,
    }),

    addEmployee: builder.mutation({
      query: (newEmployee) => ({
        url: '/employees/',
        method: 'POST',
        body: newEmployee,
      }),
    }),
  }),
});

export const {
  useTokenVerifyMutation,
  useRefreshTokenMutation,
  useLoginMutation,
  useGetEmployeesQuery,
  useGetEmployeeIdQuery,
  useGetEmployesInRequestsPerformerQuery,
  useGetEmployesInRequestsUploaderQuery,
  useGetRequestsQuery,
  useAddEmployeeMutation,
} = api;

export default api;
