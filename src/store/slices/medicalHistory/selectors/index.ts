import { RootState } from '@/store';

export const selectMedicalHistory = (state: RootState) => state.medicalHistory;

export const selectMedicalHistoryData = (state: RootState) => state.medicalHistory.medicalHistory;

export const selectMedicalHistoryLoading = (state: RootState) => state.medicalHistory.isLoading;

export const selectMedicalHistoryError = (state: RootState) => state.medicalHistory.error;

export const selectMedicalHistoryLastUpdated = (state: RootState) => state.medicalHistory.lastUpdated;

export const selectCurrentPatientId = (state: RootState) => state.medicalHistory.currentPatientId;

export const selectMedicalHistoryStats = (state: RootState) => {
  const medicalHistory = state.medicalHistory.medicalHistory;
  
  if (!medicalHistory) {
    return {
      totalAppointments: 0,
      totalTreatments: 0,
      activeTreatments: 0,
      totalObservations: 0,
      totalExaminations: 0
    };
  }

  const totalAppointments = Array.isArray(medicalHistory.medicalAppointmentIds) 
    ? medicalHistory.medicalAppointmentIds.length 
    : 0;
    
  const totalExaminations = Array.isArray(medicalHistory.medicalExaminationIds) 
    ? medicalHistory.medicalExaminationIds.length 
    : 0;

  const appointmentResultsCount = Array.isArray(medicalHistory.appointmentResultIds) 
    ? medicalHistory.appointmentResultIds.length 
    : 0;

  const estimatedTreatments = appointmentResultsCount;
  const estimatedObservations = appointmentResultsCount;

  const estimatedActiveTreatments = Math.ceil(estimatedTreatments / 2);

  return {
    totalAppointments,
    totalTreatments: estimatedTreatments,
    activeTreatments: estimatedActiveTreatments,
    totalObservations: estimatedObservations,
    totalExaminations
  };
};