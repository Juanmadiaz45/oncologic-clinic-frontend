import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearAuthToken } from '@/services/api/client';
import { TOKEN_KEY, USER_KEY } from '@/constants';

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  clearAuthToken();
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return null;
});
