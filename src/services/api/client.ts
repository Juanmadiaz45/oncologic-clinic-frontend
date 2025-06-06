// src/services/api/client.ts
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  API_BASE_URL,
  MESSAGES,
  ROUTES,
  TOKEN_KEY,
  API_ENDPOINTS,
} from '@/constants';
import { ApiError } from '@/types';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken: string | null = null;

// Endpoints that DO NOT require authentication
const PUBLIC_ENDPOINTS = [
  API_ENDPOINTS.LOGIN,
  API_ENDPOINTS.FORGOT_PASSWORD,
  // Add other public endpoints here
];

export const setAuthToken = (token: string | null) => {
  authToken = token;
  console.log('Token configurado:', token ? 'Sí' : 'No');
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
  authToken = null;
};

// Initialize token from localStorage on app start
const initializeToken = () => {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  if (storedToken) {
    setAuthToken(storedToken);
  }
};

// Call initialization
initializeToken();

// Store para dispatch
let reduxStore: {
  dispatch: (action: { type: string; [key: string]: unknown }) => void;
} | null = null;

export const setReduxStore = (store: {
  dispatch: (action: { type: string; [key: string]: unknown }) => void;
}) => {
  reduxStore = store;
};

// Helper to check if an endpoint is public
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only add token if it is NOT a public endpoint and we have a token
    if (authToken && !isPublicEndpoint(config.url || '')) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log('Request con Authorization header:', config.url);
    } else {
      console.log('Request SIN Authorization header:', config.url);
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const endTime = new Date();
      const duration =
        endTime.getTime() - response.config.metadata.startTime.getTime();
      console.log(
        `API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${duration}ms`
      );
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      console.error(`API Error ${status}:`, error.config?.url, data);

      switch (status) {
        case 401:
          // Solo limpiar auth si NO es un endpoint público
          if (!isPublicEndpoint(error.config?.url || '')) {
            console.warn('Token expired or invalid, logging out...');

            // Clear auth state
            clearAuthToken();
            localStorage.removeItem(TOKEN_KEY);

            // Dispatch logout action if Redux store is available
            if (reduxStore) {
              reduxStore.dispatch({ type: 'auth/logoutUser/fulfilled' });
            }

            // Redirect to login if not already there
            if (window.location.pathname !== ROUTES.LOGIN) {
              window.location.href = ROUTES.LOGIN;
            }
          }
          break;

        case 403:
          // Forbidden
          console.error('Access forbidden:', data);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', error.config?.url);
          break;

        case 422:
          // Validation error
          console.error('Validation error:', data);
          break;

        case 500:
          // Server error
          console.error('Internal server error:', data);
          break;

        default:
          console.error('API Error:', status, data);
      }

      // Transform error to our standard format
      const apiError: ApiError = {
        message:
          (data as { message?: string })?.message || MESSAGES.ERROR.NETWORK,
        status,
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      };

      return Promise.reject(apiError);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      const networkError: ApiError = {
        message: MESSAGES.ERROR.NETWORK,
        status: 0,
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      };

      return Promise.reject(networkError);
    } else {
      // Something else happened
      console.error('Unknown error:', error.message);
      const unknownError: ApiError = {
        message: error.message || 'Unknown error occurred',
        status: 0,
        timestamp: new Date().toISOString(),
        path: '',
      };

      return Promise.reject(unknownError);
    }
  }
);

// Generic API methods
export const api = {
  get: async <T = unknown>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> => {
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  post: async <T = unknown>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.post(url, data);
    return response.data;
  },

  put: async <T = unknown>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.put(url, data);
    return response.data;
  },

  patch: async <T = unknown>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.patch(url, data);
    return response.data;
  },

  delete: async <T = unknown>(url: string): Promise<T> => {
    const response = await apiClient.delete(url);
    return response.data;
  },

  // Special method for login (without token)
  login: async <T = unknown>(credentials: unknown): Promise<T> => {
    // We force this request to NOT have a token
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials, {
      headers: {
        // We override any Authorization header
        Authorization: undefined,
      },
    });
    return response.data;
  },

  // File upload method
  uploadFile: async <T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  // Download file method
  downloadFile: async (url: string, filename?: string): Promise<void> => {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

// Extend axios config interface to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

export default apiClient;
