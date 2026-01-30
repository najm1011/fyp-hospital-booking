/**
 * Extract a user-friendly error message from an API error.
 *
 * Priority:
 * 1. Server-provided message (error.response.data.message)
 * 2. Network / connection error detection
 * 3. Timeout detection
 * 4. Custom fallback message
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  // Server returned a message — use it directly
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Network error — request was made but no response received
  if (!error.response && error.request) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Request timeout
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please check your connection and try again.';
  }

  return fallback;
};
