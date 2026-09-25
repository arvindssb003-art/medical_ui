import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  const response = await authApi.post("/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await authApi.post("/login", credentials);
  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await authApi.post("/logout", {
    refreshToken,
  });

  return response.data;
};