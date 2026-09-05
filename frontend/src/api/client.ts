import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create a global event target for 401 Unauthorized errors
export const authEventEmitter = new EventTarget();

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize errors
    let errorMessage = 'An unexpected error occurred';
    let details = null;

    if (error.response) {
      if (error.response.status === 401) {
        authEventEmitter.dispatchEvent(new Event('unauthorized'));
      }
      const data = error.response.data;
      if (data && typeof data === 'object') {
        errorMessage = data.error || data.detail || errorMessage;
        details = data.details || null;
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    } else {
      errorMessage = error.message;
    }

    const normalizedError = {
      message: errorMessage,
      details,
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  }
);
