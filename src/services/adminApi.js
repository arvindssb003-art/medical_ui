import apiClient from "./apiClient";

export const getAdminMedicines = async () => {
  const response = await apiClient.get("/api/medicines");
  return response.data;
};

export const createAdminMedicine = async (medicine) => {
  const response = await apiClient.post("/api/medicines", medicine);
  return response.data;
};

export const updateAdminMedicine = async (medicineId, medicine) => {
  const response = await apiClient.put(
    `/api/medicines/${medicineId}`,
    medicine
  );
  return response.data;
};

export const setAdminMedicineActive = async (medicineId, medicine) => {
  const response = await apiClient.put(`/api/medicines/${medicineId}`, medicine);
  return response.data;
};

export const createMedicineInventory = async (
  medicineId,
  quantity,
  reorderLevel
) => {
  const response = await apiClient.post("/api/inventory", {
    medicineId,
    availableQuantity: quantity,
    reservedQuantity: 0,
    reorderLevel,
  });
  return response.data;
};

export const previewMedicineImport = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post(
    "/api/medicines/import/preview",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const commitMedicineImport = async (importId) => {
  const response = await apiClient.post(
    `/api/medicines/import/${encodeURIComponent(importId)}/commit`
  );
  return response.data;
};

export const getAdminOrders = async () => {
  const response = await apiClient.get("/api/admin/orders");
  return response.data;
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const response = await apiClient.patch(
    `/api/admin/orders/${orderId}/status`,
    { status }
  );
  return response.data;
};
