// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '@/types/dashboard';
import dashboardService from '@/services/dashboard/dashboardService';
import { useAuth } from '@/hooks/useAuth';

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

  const { isAuthenticated, currentUser, hasAnyRole, logout } = useAuth();

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated) {
        logout();
        return;
      }

      console.log('Current user in dashboard hook:', currentUser);
      
      if (!currentUser || !hasAnyRole(['DOCTOR', 'ADMIN'])) {
        setError('Acceso denegado: se requiere rol de doctor o administrador');
        return;
      }

      // El servicio ya maneja los errores internamente y devuelve datos por defecto
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
      
      // Solo mostrar error si hay problemas de autenticación
      setError(null);
      
    } catch (err) {
      let errorMessage = 'Error loading dashboard data';

      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('Error loading dashboard:', err);

      // Solo hacer logout si es error de autenticación
      if (errorMessage.includes('autenticado') || errorMessage.includes('Session expired')) {
        logout();
        return;
      }

      // Para otros errores, mostrar dashboard con datos vacíos
      setDashboardData({
        metrics: {
          appointmentsToday: 0,
          activePatients: 0,
          pendingResults: 0,
          currentDate: new Date().getDate().toString(),
          currentDay: new Date().toLocaleDateString('es-ES', { weekday: 'long' })
        },
        todayAppointments: [],
        pendingTasks: [],
        nextAppointment: null
      });
      
      // Mostrar error pero no bloquear el dashboard
      setError('Algunos datos no pudieron cargarse correctamente');
      
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser, hasAnyRole, logout]);

  const refreshData = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && isAuthenticated) {
        refreshData();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [refreshData, isLoading, isAuthenticated]);

  return {
    dashboardData,
    isLoading,
    error,
    refreshData,
  };
};
