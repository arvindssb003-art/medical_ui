import axios from "axios";

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
      config.headers.Authorization = `Bearer ${accessToken}`;
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

export default apiClient;