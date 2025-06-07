// src/store/slices/appointment/slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './types/state';
import * as asyncActions from './actions';
import { formReducers } from './reducers/formReducers';
import { stepReducers } from './reducers/stepReducers';
import { taskReducers } from './reducers/taskReducers';
import { errorReducers } from './reducers/errorReducers';
import { searchReducers } from './reducers/searchReducers';

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    ...formReducers,
    ...stepReducers,
    ...taskReducers,
    ...searchReducers,
    ...errorReducers,
  },
  extraReducers: builder => {
    // Configure extraReducers for each asynchronous action
    // Search patients
    builder
      .addCase(asyncActions.searchPatients.pending, state => {
        state.isSearchingPatients = true;
      })
      .addCase(asyncActions.searchPatients.fulfilled, (state, action) => {
        state.isSearchingPatients = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(asyncActions.searchPatients.rejected, (state, action) => {
        state.isSearchingPatients = false;
        state.error = action.error.message || 'Error searching patients';
        state.searchResults = [];
      });

    // Load appointment types
    builder
      .addCase(asyncActions.loadAppointmentTypes.pending, state => {
        state.isLoadingTypes = true;
      })
      .addCase(asyncActions.loadAppointmentTypes.fulfilled, (state, action) => {
        state.isLoadingTypes = false;
        state.baseAppointments = action.payload.baseAppointments;
        state.appointmentTypes = action.payload.appointmentTypes;
        state.error = null;
      })
      .addCase(asyncActions.loadAppointmentTypes.rejected, (state, action) => {
        state.isLoadingTypes = false;
        state.error = action.error.message || 'Error loading appointment types';
      });

    // Calculate duration
    builder
      .addCase(asyncActions.calculateDuration.pending, state => {
        state.isCalculatingDuration = true;
      })
      .addCase(asyncActions.calculateDuration.fulfilled, (state, action) => {
        state.isCalculatingDuration = false;
        state.formData.baseAppointmentId = action.payload.baseAppointmentId;
        state.formData.duration = action.payload.duration;
        state.formData.medicalTasks = action.payload.medicalTasks;
        state.error = null;
      })
      .addCase(asyncActions.calculateDuration.rejected, (state, action) => {
        state.isCalculatingDuration = false;
        state.error = action.error.message || 'Error calculating duration';
      });

    // Save appointment
    builder
      .addCase(asyncActions.saveAppointment.pending, state => {
        state.isSaving = true;
      })
      .addCase(asyncActions.saveAppointment.fulfilled, state => {
        state.isSaving = false;
        state.error = null;
        // Reset form after successful saving
        state.formData = initialState.formData;
        state.currentStep = 1;
      })
      .addCase(asyncActions.saveAppointment.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Error saving appointment';
      });
  },
});

export default appointmentSlice;
