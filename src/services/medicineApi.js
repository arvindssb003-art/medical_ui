import apiClient from "./apiClient";

export const getActiveMedicines = async () => {
  const response = await apiClient.get("/api/medicines/active");
  return response.data;
};

export const getMedicineById = async (id) => {
  const response = await apiClient.get(`/api/medicines/${id}`);
  return response.data;
};
