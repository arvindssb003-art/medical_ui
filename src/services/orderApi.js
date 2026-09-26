import apiClient from "./apiClient";

export const createOrder = async (orderData) => {
  const response = await apiClient.post(
    "/api/orders",
    orderData
  );

  return response.data;
};

export const getUserOrders = async () => {
  const response = await apiClient.get("/api/orders");
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await apiClient.get(
    `/api/orders/${orderId}`
  );

  return response.data;
};

export const cancelOrder = async (orderId) => {
  await apiClient.delete(`/api/orders/${orderId}`);
};
