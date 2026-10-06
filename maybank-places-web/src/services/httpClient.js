import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Turn axios errors into a plain Error carrying the backend's message and HTTP status
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      (error.response ? `Request failed (${status})` : 'Cannot reach the server. Is the Spring Boot API running?');
    const apiError = new Error(message);
    apiError.status = status;
    return Promise.reject(apiError);
  },
);

export default httpClient;
