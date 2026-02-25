import api from './api';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  TOKEN_EXPIRY: 'tokenExpiry',
  REMEMBER_ME: 'rememberMe',
};

// Helper to decode JWT and get expiry
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Helper to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // Check if token expires in less than 60 seconds (buffer time)
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime + 60;
};

// Get the active storage based on rememberMe preference
const getStorage = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
      ? localStorage
      : sessionStorage;
  } catch {
    return localStorage;
  }
};

// Helper to safely get item from active storage
const getStorageItem = (key) => {
  try {
    // Check active storage first, fallback to the other (handles mid-session switches)
    return getStorage().getItem(key) || localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return null;
  }
};

// Helper to safely set item in active storage
const setStorageItem = (key, value) => {
  try {
    getStorage().setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error);
    return false;
  }
};

// Helper to safely remove item from both storages
const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

// Set remember me preference (always in localStorage so we can find it on reload)
const setRememberMe = (value) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, value ? 'true' : 'false');
  } catch {}
};

// Store auth data in the active storage
const storeAuthData = (data) => {
  if (data.accessToken) {
    setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);

    // Store token expiry time
    const decoded = decodeToken(data.accessToken);
    if (decoded?.exp) {
      setStorageItem(STORAGE_KEYS.TOKEN_EXPIRY, decoded.exp.toString());
    }
  }

  if (data.refreshToken) {
    setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
  }

  if (data.user) {
    setStorageItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  }

  // Dispatch storage event for cross-tab sync
  window.dispatchEvent(new Event('auth-storage-change'));
};

// Clear all auth data from both storages
const clearAuthData = () => {
  removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
  removeStorageItem(STORAGE_KEYS.USER);
  removeStorageItem(STORAGE_KEYS.TOKEN_EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

  // Dispatch storage event for cross-tab sync
  window.dispatchEvent(new Event('auth-storage-change'));
};

const authService = {
  // Register a new user (always remembers session)
  register: async (userData) => {
    setRememberMe(true);
    const response = await api.post('/auth/register', userData);
    if (response.data.accessToken) {
      storeAuthData(response.data);
    }
    return response.data;
  },

  // Login user
  login: async (credentials, rememberMe = false) => {
    setRememberMe(rememberMe);
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      storeAuthData(response.data);
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    clearAuthData();
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    if (response.data.accessToken) {
      storeAuthData(response.data);
    }
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = getStorageItem(STORAGE_KEYS.USER);
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  // Update stored user data
  updateStoredUser: (userData) => {
    setStorageItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    window.dispatchEvent(new Event('auth-storage-change'));
  },

  // Check if user is authenticated (has valid token)
  isAuthenticated: () => {
    const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token && !isTokenExpired(token);
  },

  // Check if token needs refresh (expired or about to expire)
  needsTokenRefresh: () => {
    const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    return isTokenExpired(token);
  },

  // Check if refresh token exists and is valid
  hasValidRefreshToken: () => {
    const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    return refreshToken && !isTokenExpired(refreshToken);
  },

  // Get access token
  getToken: () => {
    return getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Get refresh token
  getRefreshToken: () => {
    return getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Get token expiry timestamp
  getTokenExpiry: () => {
    const expiry = getStorageItem(STORAGE_KEYS.TOKEN_EXPIRY);
    return expiry ? parseInt(expiry, 10) : null;
  },

  // Validate current session
  validateSession: async () => {
    const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);

    // No token stored
    if (!token) {
      return { valid: false, reason: 'no_token' };
    }

    // Token is expired
    if (isTokenExpired(token)) {
      // Try to refresh
      const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          await authService.refreshToken();
          return { valid: true, refreshed: true };
        } catch (error) {
          clearAuthData();
          return { valid: false, reason: 'refresh_failed' };
        }
      }
      clearAuthData();
      return { valid: false, reason: 'token_expired' };
    }

    return { valid: true };
  },

  // Request password reset email
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Storage keys for external use
  STORAGE_KEYS,
};

export default authService;
