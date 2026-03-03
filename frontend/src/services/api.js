import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds — accounts for Render cold starts
});

// Helper to get token from active storage
const getToken = (key) => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  return storage.getItem(key) || localStorage.getItem(key) || sessionStorage.getItem(key);
};

// Request interceptor - adds JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for auth endpoints (login, register, etc.)
    const isAuthRequest = originalRequest.url?.includes('/auth/');

    // If 401 and not already retrying and not an auth request
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      const refreshTokenValue = getToken('refreshToken');

      if (refreshTokenValue) {
        try {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshTokenValue,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Store new tokens in the active storage
          const rememberMe = localStorage.getItem('rememberMe') === 'true';
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('accessToken', accessToken);
          storage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear tokens from both storages and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
