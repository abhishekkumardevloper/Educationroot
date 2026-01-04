import axios from "axios";

// ✅ Vite env variable
const BACKEND_URL = import.meta.env.VITE_API_URL;

// Safety check (optional but recommended)
if (!BACKEND_URL) {
  console.error("VITE_API_URL is not defined");
}

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
