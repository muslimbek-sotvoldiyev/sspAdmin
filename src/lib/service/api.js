import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://staffflow.pythonanywhere.com/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      let parsedToken;
      try {
        parsedToken = JSON.parse(token);
      } catch (e) {
        console.error("Invalid token in localStorage:", e);
      }

      if (parsedToken?.access) {
        headers.set("Authorization", `Bearer ${parsedToken.access}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ phone_number, password }) => ({
        url: "/token/",
        method: "POST",
        body: { phone_number, password },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    tokenVerify: builder.mutation({
      query: (token) => ({
        url: "/token/verify/",
        method: "POST",
        body: { token },
      }),
    }),
    refreshToken: builder.mutation({
      query: (refresh) => ({
        url: "/token/refresh/",
        method: "POST",
        body: { refresh },
      }),
    }),

    getServices: builder.query({
      query: () => "/service/",
    }),
    getEmployees: builder.query({
      query: ({ page = 1, page_size = 10 }) =>
        `employees/?page=${page}&page_size=${page_size}`,
    }),

    getEmployeesId: builder.query({
      query: ({ id }) => `employees/${id}/`,
    }),
    getRequest: builder.query({
      query: ({ page = 1, page_size = 10, employee }) =>
        `employees/?page=${page}&page_size=${page_size}&employee=${employee}`,
    }),
  }),
});

export const {
  useTokenVerifyMutation,
  useRefreshTokenMutation,
  useLoginMutation,
  useGetEmployeesQuery,
  useGetEmployeesIdQuery,
  useGetRequestQuery,
} = api;
export default api;
