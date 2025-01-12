// api/axiosClient.js
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://doctorhelper.pythonanywhere.com/api/v1/";
const API_TIMEOUT = 10000;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const { access } = JSON.parse(authToken);
        if (access) {
          config.headers.Authorization = `Bearer ${access}`;
        }
      }
      return config;
    } catch (error) {
      console.error("Error processing auth token:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = JSON.parse(
          localStorage.getItem("authToken")
        )?.refresh;
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
            refresh: refreshToken,
          });

          if (response.data.access) {
            localStorage.setItem(
              "authToken",
              JSON.stringify({
                access: response.data.access,
                refresh: refreshToken,
              })
            );
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return axiosClient(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
