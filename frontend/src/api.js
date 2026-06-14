import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
