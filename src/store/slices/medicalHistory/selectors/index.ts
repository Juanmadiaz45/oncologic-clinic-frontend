import { RootState } from '@/store';

export const selectMedicalHistory = (state: RootState) => state.medicalHistory;

export const selectMedicalHistoryData = (state: RootState) => state.medicalHistory.medicalHistory;

export const selectMedicalHistoryLoading = (state: RootState) => state.medicalHistory.isLoading;

export const selectMedicalHistoryError = (state: RootState) => state.medicalHistory.error;

export const selectMedicalHistoryLastUpdated = (state: RootState) => state.medicalHistory.lastUpdated;

export const selectCurrentPatientId = (state: RootState) => state.medicalHistory.currentPatientId;

// Computed selectors
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

  const now = new Date();
  const activeTreatments = medicalHistory.treatments.filter(treatment => {
    const startDate = new Date(treatment.dateStart);
    const endDate = new Date(treatment.endDate);
    return now >= startDate && now <= endDate;
  }).length;

  const totalObservations = medicalHistory.appointmentResults.reduce(
    (sum, result) => sum + result.observations.length, 0
  );

  return {
    totalAppointments: medicalHistory.medicalAppointments.length,
    totalTreatments: medicalHistory.treatments.length,
    activeTreatments,
    totalObservations,
    totalExaminations: medicalHistory.medicalExaminations.length
  };
};