export const parseApiError = (error) => {
  // If the backend provided a clean error message in our standard format
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // If the request was made but no response was received (network error, server down)
  if (error.request && !error.response) {
    return 'Unable to connect to the server. Please try again later.';
  }

  // Fallback for completely unexpected internal errors
  return error.message || 'An unexpected error occurred. Please try again later.';
};
