import { MedicalHistoryState } from '../types/state';

export const medicalHistoryReducers = {
  clearError: (state: MedicalHistoryState) => {
    state.error = null;
  },
  
  clearMedicalHistory: (state: MedicalHistoryState) => {
    state.medicalHistory = null;
    state.currentPatientId = null;
    state.lastUpdated = null;
    state.error = null;
  },

  setCurrentPatient: (state: MedicalHistoryState, action: { payload: number }) => {
    if (state.currentPatientId !== action.payload) {
      state.medicalHistory = null;
      state.lastUpdated = null;
      state.error = null;
    }
    state.currentPatientId = action.payload;
  }
};