import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for handling async operations with loading, error, and data states
 *
 * @param {Function} asyncFunction - The async function to execute
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - Whether to execute immediately on mount
 * @param {Array} options.dependencies - Dependencies array for re-execution
 * @param {Function} options.onSuccess - Callback on successful execution
 * @param {Function} options.onError - Callback on error
 */
const useAsync = (asyncFunction, options = {}) => {
  const {
    immediate = false,
    dependencies = [],
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Track the latest async function to avoid stale closures
  const asyncFunctionRef = useRef(asyncFunction);
  asyncFunctionRef.current = asyncFunction;

  // Execute the async function
  const execute = useCallback(async (...args) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    }));

    try {
      const result = await asyncFunctionRef.current(...args);

      if (isMounted.current) {
        setState({
          data: result,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        if (onSuccess) {
          onSuccess(result);
        }
      }

      return result;
    } catch (error) {
      if (isMounted.current) {
        const errorMessage = getErrorMessage(error);

        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        if (onError) {
          onError(error);
        }
      }

      throw error;
    }
  }, [onSuccess, onError]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  // Set data manually
  const setData = useCallback((data) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, isError: false }));
  }, []);

  // Execute immediately on mount if specified
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    clearError,
  };
};

/**
 * Extract error message from various error types
 */
const getErrorMessage = (error) => {
  // Axios error with response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error with response data as string
  if (error.response?.data && typeof error.response.data === 'string') {
    return error.response.data;
  }

  // Network error
  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }

  // Generic error message
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Hook for fetching data on mount
 */
export const useFetch = (asyncFunction, dependencies = []) => {
  return useAsync(asyncFunction, {
    immediate: true,
    dependencies,
  });
};

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export const useMutation = (asyncFunction, options = {}) => {
  return useAsync(asyncFunction, {
    immediate: false,
    ...options,
  });
};

export default useAsync;
