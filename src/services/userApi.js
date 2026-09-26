import apiClient from "./apiClient";

export const getUserProfile = async () => {
  const response = await apiClient.get("/api/users/profile");
  return response.data;
};
