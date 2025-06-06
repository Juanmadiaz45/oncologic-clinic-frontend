// src/store/slices/auth/slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './types/state';
import * as asyncActions from './actions';
import { errorReducers, userReducers } from './reducers';

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    ...errorReducers,
    ...userReducers,
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(asyncActions.loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(asyncActions.loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // ✅ Now we only receive the user
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(asyncActions.loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Initialize
    builder
      .addCase(asyncActions.initializeAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(asyncActions.initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;

        if (action.payload) {
          state.user = action.payload; // ✅ Only the user
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(asyncActions.initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(asyncActions.logoutUser.fulfilled, state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export default authSlice;
