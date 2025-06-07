import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  selectMedicalHistoryData,
  selectMedicalHistoryLoading,
  selectMedicalHistoryError,
  selectMedicalHistoryLastUpdated,
  selectCurrentPatientId,
  selectMedicalHistoryStats
} from '@/store/slices/medicalHistory/selectors';
import { asyncActions, clearError, setCurrentPatient } from '@/store/slices/medicalHistory';

export const useMedicalHistory = (patientId?: number) => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const medicalHistory = useAppSelector(selectMedicalHistoryData);
  const loading = useAppSelector(selectMedicalHistoryLoading);
  const error = useAppSelector(selectMedicalHistoryError);
  const lastUpdated = useAppSelector(selectMedicalHistoryLastUpdated);
  const currentPatientId = useAppSelector(selectCurrentPatientId);
  const stats = useAppSelector(selectMedicalHistoryStats);

  // Actions
  const fetchMedicalHistory = useCallback((id: number) => {
    dispatch(asyncActions.fetchMedicalHistory(id));
  }, [dispatch]);

  const updateHealthStatus = useCallback((historyId: number, healthStatus: string) => {
    dispatch(asyncActions.updateHealthStatus({ historyId, healthStatus }));
  }, [dispatch]);

  const clearMedicalHistoryError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Effect to set current patient and fetch data
  useEffect(() => {
    if (patientId) {
      dispatch(setCurrentPatient(patientId));
      
      const shouldFetch = currentPatientId !== patientId || 
                         !medicalHistory || 
                         !lastUpdated ||
                         (new Date().getTime() - new Date(lastUpdated).getTime()) > 5 * 60 * 1000; // 5 minutes
      
      if (shouldFetch) {
        fetchMedicalHistory(patientId);
      }
    }
  }, [patientId, dispatch, currentPatientId, medicalHistory, lastUpdated, fetchMedicalHistory]);

  return {
    medicalHistory,
    loading,
    error,
    lastUpdated,
    stats,
    fetchMedicalHistory: () => patientId && fetchMedicalHistory(patientId),
    updateHealthStatus,
    clearError: clearMedicalHistoryError
  };
};