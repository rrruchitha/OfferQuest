import axios, { AxiosError } from 'axios';

// ─── API Base URL ───────────────────────────────────────────────────────────
// Local: http://localhost:5000/api/v1
// Production: comes from VITE_API_URL

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';


// ─── Axios Instance ─────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },

  timeout: 15000,
});


// ─── Request Interceptor: Attach JWT Token ──────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('oq_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ─── Response Interceptor: Handle Auth Errors ───────────────────────────────

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error: AxiosError) => {

    if (error.response?.status === 401) {

      // Clear persisted authentication
      localStorage.removeItem('oq_token');
      localStorage.removeItem('oq_user');


      // Avoid redirect loop
      const currentPath = window.location.pathname;

      if (
        currentPath !== '/login' &&
        currentPath !== '/register'
      ) {
        window.location.href = '/login';
      }
    }


    return Promise.reject(error);
  }
);


// ─── Export ─────────────────────────────────────────────────────────────────

export default api;