// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '@/types/dashboard';
import dashboardService from '@/services/dashboard/dashboardService';
import authService from '@/services/auth/authService';

interface UseDashboardReturn {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentUser = authService.getCurrentUser();
      console.log('Current user in dashboard hook:', currentUser); // Para debug

      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      let errorMessage = 'Error loading dashboard data';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Error loading dashboard:', err);

      if (
        errorMessage.includes('autenticado') ||
        errorMessage.includes('Session expired')
      ) {
        authService.logout();
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && authService.isAuthenticated()) {
        refreshData();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [refreshData, isLoading]);

  return {
    dashboardData,
    isLoading,
    error,
    refreshData,
  };
};
