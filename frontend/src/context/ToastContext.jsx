import { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/ui/ToastContainer';

const ToastContext = createContext(null);

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children, position = 'top-right' }) => {
  const [toasts, setToasts] = useState([]);

  // Generate unique ID
  const generateId = () => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add a new toast
  const addToast = useCallback((options) => {
    const id = generateId();
    const toast = {
      id,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration !== undefined ? options.duration : 5000,
    };

    setToasts((prev) => [...prev, toast]);

    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const toast = useCallback((message, options = {}) => {
    return addToast({ message, ...options });
  }, [addToast]);

  toast.success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  toast.error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options });
  }, [addToast]);

  toast.warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  toast.info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  // Promise-based toast (for async operations)
  toast.promise = useCallback(async (promise, options) => {
    const {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Something went wrong',
    } = options;

    // Show loading toast
    const loadingId = addToast({
      type: 'info',
      message: loading,
      duration: 0, // Don't auto-dismiss
    });

    try {
      const result = await promise;

      // Remove loading toast and show success
      removeToast(loadingId);
      addToast({
        type: 'success',
        message: typeof success === 'function' ? success(result) : success,
      });

      return result;
    } catch (err) {
      // Remove loading toast and show error
      removeToast(loadingId);
      addToast({
        type: 'error',
        message: typeof error === 'function' ? error(err) : error,
      });

      throw err;
    }
  }, [addToast, removeToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        position={position}
      />
    </ToastContext.Provider>
  );
};

export default ToastContext;
