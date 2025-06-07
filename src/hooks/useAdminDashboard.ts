import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  selectAdminStats, 
  selectAdminStatsLoading, 
  selectAdminStatsError,
  selectAdminStatsLastUpdated 
} from '@/store/slices/adminDashboard/selectors';
import { asyncActions, clearError } from '@/store/slices/adminDashboard';

export const useAdminDashboard = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const stats = useAppSelector(selectAdminStats);
  const loading = useAppSelector(selectAdminStatsLoading);
  const error = useAppSelector(selectAdminStatsError);
  const lastUpdated = useAppSelector(selectAdminStatsLastUpdated);

  // Actions
  const fetchStats = useCallback(() => {
    dispatch(asyncActions.fetchAdminStats());
  }, [dispatch]);

  const clearStatsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-fetch on mount
  useEffect(() => {
    if (!lastUpdated) {
      fetchStats();
    }
  }, [fetchStats, lastUpdated]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchStats();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [fetchStats, loading]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    fetchStats,
    clearError: clearStatsError
  };
};