import { useState } from 'react';
import { AxiosError } from 'axios';
import authService from '@/services/auth/authService';
import { LoginRequest } from '@/types';
import { ROUTES, MESSAGES } from '@/constants';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (credentials: LoginRequest) => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Por favor ingresa usuario y contraseña');
      return false;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.login(credentials);
      window.location.href = ROUTES.DASHBOARD;
      return true;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || MESSAGES.ERROR.LOGIN);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    login,
    isLoading,
    error,
    clearError,
    isAuthenticated: authService.isAuthenticated(),
  };
};
