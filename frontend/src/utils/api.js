// src/utils/api.js

import axios from "axios";

/**
 * Backend base URL
 * Must be defined in environment variables
 * Example (Vercel / .env):
 * REACT_APP_BACKEND_URL=https://api.yoursite.com
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Warn clearly if env is missing (helps debugging on Vercel)
if (!BACKEND_URL) {
  console.error(
    "❌ REACT_APP_BACKEND_URL is not defined. Please set it in environment variables."
  );
}

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : "/api", // fallback prevents crash
  timeout: 15000, // 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Adds auth token automatically
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor (optional but professional)
 * Handles common auth errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Unauthorized → token invalid or expired
      if (error.response.status === 401) {
        console.warn("⚠️ Unauthorized. Token may be expired.");

        // Optional auto logout
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
