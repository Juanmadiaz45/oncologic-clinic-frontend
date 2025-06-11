import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const selectMedicalHistory = (state: RootState) => state.medicalHistory;

export const selectMedicalHistoryData = (state: RootState) => state.medicalHistory.medicalHistory;

export const selectMedicalHistoryLoading = (state: RootState) => state.medicalHistory.isLoading;

export const selectMedicalHistoryError = (state: RootState) => state.medicalHistory.error;

export const selectMedicalHistoryLastUpdated = (state: RootState) => state.medicalHistory.lastUpdated;

export const selectCurrentPatientId = (state: RootState) => state.medicalHistory.currentPatientId;

// Computed selectors
export const selectMedicalHistoryStats = createSelector(
  [selectMedicalHistoryData],
  (medicalHistory) => {
    if (!medicalHistory) {
      return {
        totalAppointments: 0,
        totalExaminations: 0,
        totalAppointmentResults: 0,
        totalExaminationResults: 0
      };
    }

    return {
      totalAppointments: medicalHistory.medicalAppointmentIds?.length || 0,
      totalExaminations: medicalHistory.medicalExaminationIds?.length || 0,
      totalAppointmentResults: medicalHistory.appointmentResultIds?.length || 0,
      totalExaminationResults: medicalHistory.examinationResultIds?.length || 0
    };
  }
);