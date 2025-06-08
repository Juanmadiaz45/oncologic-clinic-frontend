// src/store/slices/appointment/slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './types/state';
import * as asyncActions from './actions';
import * as step2AsyncActions from './actions/step2Actions';
import { formReducers } from './reducers/formReducers';
import { stepReducers } from './reducers/stepReducers';
import { taskReducers } from './reducers/taskReducers';
import { errorReducers } from './reducers/errorReducers';
import { searchReducers } from './reducers/searchReducers';
import { step2Reducers } from './reducers/step2Reducers';

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    ...formReducers,
    ...stepReducers,
    ...taskReducers,
    ...searchReducers,
    ...errorReducers,
    ...step2Reducers,
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

    // Search doctors
    builder
      .addCase(step2AsyncActions.searchDoctors.pending, state => {
        state.isSearchingDoctors = true;
      })
      .addCase(step2AsyncActions.searchDoctors.fulfilled, (state, action) => {
        state.isSearchingDoctors = false;
        state.formData.step2.availableDoctors = action.payload;
      })
      .addCase(step2AsyncActions.searchDoctors.rejected, state => {
        state.isSearchingDoctors = false;
        state.formData.step2.availableDoctors = [];
      });

    // Get doctors by speciality
    builder
      .addCase(step2AsyncActions.getDoctorsBySpeciality.pending, state => {
        state.isLoadingDoctors = true;
      })
      .addCase(
        step2AsyncActions.getDoctorsBySpeciality.fulfilled,
        (state, action) => {
          state.isLoadingDoctors = false;
          state.formData.step2.availableDoctors = action.payload;
        }
      )
      .addCase(step2AsyncActions.getDoctorsBySpeciality.rejected, state => {
        state.isLoadingDoctors = false;
        state.formData.step2.availableDoctors = [];
      });

    // Get doctor availabilities
    builder.addCase(
      step2AsyncActions.getPersonalAvailabilities.fulfilled,
      (state, action) => {
        state.formData.step2.doctorAvailabilities = action.payload;
      }
    );

    // Generate time slots
    builder
      .addCase(step2AsyncActions.generateTimeSlots.pending, state => {
        state.isLoadingTimeSlots = true;
      })
      .addCase(
        step2AsyncActions.generateTimeSlots.fulfilled,
        (state, action) => {
          state.isLoadingTimeSlots = false;
          state.formData.step2.availableTimeSlots = action.payload;
        }
      )
      .addCase(step2AsyncActions.generateTimeSlots.rejected, state => {
        state.isLoadingTimeSlots = false;
        state.formData.step2.availableTimeSlots = [];
      });

    // Get available offices
    builder
      .addCase(step2AsyncActions.getAvailableOffices.pending, state => {
        state.isLoadingOffices = true;
      })
      .addCase(
        step2AsyncActions.getAvailableOffices.fulfilled,
        (state, action) => {
          state.isLoadingOffices = false;
          state.formData.step2.availableOffices = action.payload;
        }
      )
      .addCase(step2AsyncActions.getAvailableOffices.rejected, state => {
        state.isLoadingOffices = false;
        state.formData.step2.availableOffices = [];
      });

    // Create appointment
    builder
      .addCase(step2AsyncActions.createAppointment.pending, state => {
        state.isCreatingAppointment = true;
      })
      .addCase(step2AsyncActions.createAppointment.fulfilled, state => {
        state.isCreatingAppointment = false;
        // Reset form after successful creation
        state.formData = initialState.formData;
        state.currentStep = 1;
      })
      .addCase(
        step2AsyncActions.createAppointment.rejected,
        (state, action) => {
          state.isCreatingAppointment = false;
          state.error = action.error.message || 'Error creating appointment';
        }
      );
  },
});

export default appointmentSlice;
