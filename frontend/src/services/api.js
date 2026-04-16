import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const fetchOrders = async () => {
  const response = await api.get("/orders");
  return response.data?.data || [];
};

export const fetchAnalytics = async (filters = {}) => {
  const response = await api.get("/analytics", { params: filters });
  return response.data?.data || {};
};

export const uploadReport = async ({ file, clientId = "demo-client" }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("clientId", clientId);

  const response = await api.post("/reports/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const recalculateReport = async (payload) => {
  const response = await api.post("/reports/recalculate", payload);
  return response.data;
};

export const getStatusMappings = async (clientId = "demo-client") => {
  const response = await api.get("/status-mappings", { params: { clientId } });
  return response.data?.data || [];
};

export const saveStatusMappings = async ({ clientId = "demo-client", mappings = [] }) => {
  const response = await api.post("/status-mappings/save", { clientId, mappings });
  return response.data;
};

export default api;
