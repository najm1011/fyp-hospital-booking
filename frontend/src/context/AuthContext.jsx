import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Create the context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);

  // Sync auth state from localStorage
  const syncAuthState = useCallback(() => {
    const storedUser = authService.getCurrentUser();
    const hasValidToken = authService.isAuthenticated();

    if (storedUser && hasValidToken) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setSessionError(null);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Initialize auth state and validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        // Validate the current session
        const result = await authService.validateSession();

        if (result.valid) {
          const storedUser = authService.getCurrentUser();
          setUser(storedUser);
          setIsAuthenticated(true);
          setSessionError(null);
        } else {
          setUser(null);
          setIsAuthenticated(false);

          // Set appropriate error message
          if (result.reason === 'token_expired') {
            setSessionError('Your session has expired. Please log in again.');
          } else if (result.reason === 'refresh_failed') {
            setSessionError('Session refresh failed. Please log in again.');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Handle standard storage events from other tabs
      if (event.key === authService.STORAGE_KEYS.ACCESS_TOKEN ||
          event.key === authService.STORAGE_KEYS.USER ||
          event.key === null) { // null means clear() was called
        syncAuthState();
      }
    };

    // Handle custom auth-storage-change events from same tab
    const handleAuthChange = () => {
      syncAuthState();
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events from same tab
    window.addEventListener('auth-storage-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-storage-change', handleAuthChange);
    };
  }, [syncAuthState]);

  // Set up token refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check token expiry every minute
    const checkInterval = setInterval(async () => {
      if (authService.needsTokenRefresh()) {
        try {
          if (authService.hasValidRefreshToken()) {
            await authService.refreshToken();
            syncAuthState();
          } else {
            // No valid refresh token, log out
            logout();
            setSessionError('Your session has expired. Please log in again.');
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
          setSessionError('Session refresh failed. Please log in again.');
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isAuthenticated, syncAuthState]);

  // Login function
  const login = async (credentials, rememberMe = false) => {
    setSessionError(null);
    const response = await authService.login(credentials, rememberMe);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  // Register function
  const register = async (userData) => {
    setSessionError(null);
    const response = await authService.register(userData);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setSessionError(null);
  }, []);

  // Update user in context and localStorage
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    authService.updateStoredUser(updatedUser);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Clear session error
  const clearSessionError = () => {
    setSessionError(null);
  };

  // Force re-validate session
  const revalidateSession = async () => {
    setIsLoading(true);
    try {
      const result = await authService.validateSession();
      if (result.valid) {
        syncAuthState();
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    sessionError,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    clearSessionError,
    revalidateSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
