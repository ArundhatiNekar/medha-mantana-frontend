// ✅ src/api/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ Backend URL from .env
});

// Automatically attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Example: Profile update API call
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/api/auth/update-profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
