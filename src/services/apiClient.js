import axios from "axios";
import { refreshUserToken } from "./authApi";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = "Bearer " + accessToken;
    }

    const user = localStorage.getItem("user");

    if (user) {
      try {
        const parsedUser = JSON.parse(user);

        if (parsedUser?.id) {
          config.headers["X-User-Id"] = parsedUser.id;
        }
      } catch (error) {
        console.error("Invalid stored user data:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshRequest;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      refreshRequest ??= refreshUserToken(refreshToken)
        .then((tokens) => {
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          return tokens.accessToken;
        })
        .finally(() => {
          refreshRequest = null;
        });

      const accessToken = await refreshRequest;
      originalRequest.headers.Authorization = "Bearer " + accessToken;
      return apiClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:session-expired"));
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
