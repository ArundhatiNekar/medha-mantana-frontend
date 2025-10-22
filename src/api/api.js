// src/api/api.js
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // backend base URL
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

export default API;
