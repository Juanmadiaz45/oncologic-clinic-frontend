import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './types/state';
import { fetchMedicalHistory, updateHealthStatus } from './actions';
import { medicalHistoryReducers } from './reducers/medicalHistoryReducers';

const medicalHistorySlice = createSlice({
  name: 'medicalHistory',
  initialState,
  reducers: {
    ...medicalHistoryReducers
  },
  extraReducers: builder => {
    // Fetch medical history
    builder
      .addCase(fetchMedicalHistory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedicalHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalHistory = action.payload.medicalHistory;
        state.currentPatientId = action.payload.patientId;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMedicalHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update health status
    builder
      .addCase(updateHealthStatus.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateHealthStatus.fulfilled, (state, action) => {
        if (state.medicalHistory) {
          state.medicalHistory.currentHealthStatus = action.payload;
          state.lastUpdated = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(updateHealthStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearMedicalHistory, setCurrentPatient } = medicalHistorySlice.actions;
export default medicalHistorySlice;