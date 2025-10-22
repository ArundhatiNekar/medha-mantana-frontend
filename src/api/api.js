// ✅ src/api/api.js
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://medha-mantana-backend.onrender.com", // fallback for production
});

// Automatically attach JWT token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Example: Profile update API call
export const updateProfile = async (profileData) => {
  try {
    const response = await API.put("/api/auth/update-profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default API;
