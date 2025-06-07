import { RootState } from '@/store';

export const selectAdminDashboard = (state: RootState) => state.adminDashboard;

export const selectAdminStats = (state: RootState) => state.adminDashboard.stats;

export const selectAdminStatsLoading = (state: RootState) => state.adminDashboard.isLoading;

export const selectAdminStatsError = (state: RootState) => state.adminDashboard.error;

export const selectAdminStatsLastUpdated = (state: RootState) => state.adminDashboard.lastUpdated;