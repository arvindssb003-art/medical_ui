import apiClient from "./apiClient";

export const getPaymentByOrderId = async (orderId) => {
  const response = await apiClient.get(
    `/api/payments/order/${orderId}`
  );

  return response.data;
};
