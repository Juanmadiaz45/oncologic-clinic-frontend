import { AdminDashboardState } from '../types/state';

export const statsReducers = {
  clearError: (state: AdminDashboardState) => {
    state.error = null;
  },
  
  resetStats: (state: AdminDashboardState) => {
    state.stats = {
      totalPatients: 0,
      totalDoctors: 0,
      totalAdministrative: 0,
      totalPersonal: 0
    };
    state.error = null;
    state.lastUpdated = null;
  }
};