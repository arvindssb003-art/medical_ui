import apiClient from "./apiClient";

export const getCart = async (userId) => {
  const response = await apiClient.get(`/api/cart/${userId}`);
  return response.data;
};

export const addToCart = async (
  userId,
  medicineId,
  quantity = 1
) => {
  const response = await apiClient.post(
    `/api/cart/${userId}/items`,
    {
      medicineId,
      quantity,
    }
  );

  return response.data;
};

export const removeFromCart = async (
  userId,
  medicineId
) => {
  const response = await apiClient.delete(
    `/api/cart/${userId}/items/${medicineId}`
  );

  return response.data;
};

export const clearCart = async (userId) => {
  await apiClient.delete(`/api/cart/${userId}`);
};