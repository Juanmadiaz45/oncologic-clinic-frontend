import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthToken, clearAuthToken } from '@/services/api/client';
import { TOKEN_KEY, USER_KEY } from '@/constants';
import { User } from '@/types';

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedToken || !storedUser) return null;

      setAuthToken(storedToken);
      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      clearAuthToken();
      return rejectWithValue('Error al inicializar autenticación');
    }
  }
);
