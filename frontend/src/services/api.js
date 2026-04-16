import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchOrders = async () => {
  const response = await api.get("/orders");
  return response.data?.data || [];
};

export const createOrder = async (payload) => {
  const response = await api.post("/orders", payload);
  return response.data?.data;
};

export const fetchAnalytics = async () => {
  const response = await api.get("/analytics");
  return response.data?.data || {};
};

export default api;
