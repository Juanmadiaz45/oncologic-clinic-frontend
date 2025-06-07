import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './types/state';
import { fetchAdminStats } from './actions';
import { statsReducers } from './reducers/statsReducers';

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    ...statsReducers
  },
  extraReducers: builder => {
    // Fetch admin stats
    builder
      .addCase(fetchAdminStats.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, resetStats } = adminDashboardSlice.actions;
export default adminDashboardSlice;