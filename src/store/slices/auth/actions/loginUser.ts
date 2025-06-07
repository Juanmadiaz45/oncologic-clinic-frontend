import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, setAuthToken } from '@/services/api/client';
import { MESSAGES, TOKEN_KEY, USER_KEY } from '@/constants';
import { LoginRequest, LoginResponse } from '@/types';
import { AxiosError } from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.login<LoginResponse>(credentials);

      // Set token in API client
      setAuthToken(response.accessToken);

      // Store token separately for API client
      localStorage.setItem(TOKEN_KEY, response.accessToken);

      // Normalize roles
      const normalizedUser = {
        ...response.user,
        roles: response.user.roles.map(role => ({
          ...role,
          name: role.name.startsWith('ROLE_')
            ? role.name.substring(5)
            : role.name,
        })),
      };

      // Store user info in localStorage for persistence
      localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));

      return normalizedUser;
    } catch (err: unknown) {
      // Use unknown as the base type
      // Verify that this is an Axios error
      if (err instanceof AxiosError) {
        return rejectWithValue(
          err.response?.data?.message || MESSAGES.ERROR.LOGIN
        );
      }

      // If it's not an Axios error, please handle other types of errors.
      return rejectWithValue(MESSAGES.ERROR.LOGIN);
    }
  }
);
