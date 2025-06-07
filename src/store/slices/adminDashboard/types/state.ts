export interface AdminDashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAdministrative: number;
  totalPersonal: number;
}

export interface AdminDashboardState {
  stats: AdminDashboardStats;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export const initialState: AdminDashboardState = {
  stats: {
    totalPatients: 0,
    totalDoctors: 0,
    totalAdministrative: 0,
    totalPersonal: 0
  },
  isLoading: false,
  error: null,
  lastUpdated: null
};