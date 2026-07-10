import { promise } from "zod"
import axios from 'axios'
const baseURL = import.meta.env.VITE_BASE_URL
export const publicInstance = axios.create({ baseURL })
export const privateInstance = axios.create({ baseURL })

// Store logout callback
let logoutCallback = null;

// Export function to register logout callback
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

// Request interceptor: adds token to Authorization header
privateInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Response interceptor: handles token expiration (401 errors)
privateInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expired or unauthorized');

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Call logout callback if it exists
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

// // / ── Setup automatic logout interceptor ───────────────────────────────────────
// This function should be called from App.jsx
export const setupLogoutInterceptor = (navigate, logout) => {
  privateInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if it's a 401 (Unauthorized) error
      if (error.response?.status === 401) {
        console.log("🔐 Token expired! Logging out automatically...");

        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Call logout from context
        logout();

        // Redirect to login''''''''''''
        navigate("/auth");

        // Show user message
        alert("Your session has expired. Please log in again.");
      }

      return Promise.reject(error);
    }
  );
};