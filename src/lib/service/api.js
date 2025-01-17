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

    getEmployees: builder.query({
      query: ({ page = 1, page_size = 10 }) =>
        `employees/?page=${page}&page_size=${page_size}`,
    }),

    getEmployeeId: builder.query({
      query: ({ id }) => `employees/${id}/`,
    }),

    getEmployesInRequests: builder.query({
      query: ({ page = 1, page_size = 10, employee  }) =>
        `/requests?employee=${employee}&page=${page}&page_size=${page_size}`,
    }),

    getRequests: builder.query({
      query: ({ page = 1, page_size = 10 }) =>
        `/requests?page=${page}&page_size=${page_size}/`,
    }),
  }),
});

export const {
  useTokenVerifyMutation,
  useRefreshTokenMutation,
  useLoginMutation,
  useGetEmployeesQuery,
  useGetEmployeeIdQuery,
  useGetEmployesInRequestsQuery,
  useGetRequestsQuery,
} = api;
export default api;
