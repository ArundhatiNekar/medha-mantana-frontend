// src/api/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Profile update function
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/update-profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
