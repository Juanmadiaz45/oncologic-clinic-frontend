import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, MESSAGES } from '@/constants';
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

export const setAuthToken = (token: string | null) => {
  authToken = token;
  console.log('Token configurado:', token ? 'Sí' : 'No');
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
  authToken = null;
  console.log('Token limpiado');
};

const initializeToken = () => {
  const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (storedToken) {
    setAuthToken(storedToken);
    console.log('Token restaurado desde storage');
  }
};

initializeToken();

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests
    if (authToken) {
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
        `API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms - ${response.status}`
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
          // Unauthorized - clear token and redirect to login
          console.log('401 Unauthorized - limpiando token y redirigiendo');
          clearAuthToken();
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
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
