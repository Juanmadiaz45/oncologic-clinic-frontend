// src/store/slices/appointment/reducers/formReducers.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { AppointmentState } from '../types/state';
import { Patient } from '@/types';
import { initialState } from '../types/state';

export const formReducers = {
  updateFormData: (
    state: AppointmentState,
    action: PayloadAction<Partial<AppointmentState['formData']>>
  ) => {
    state.formData = { ...state.formData, ...action.payload };
  },
  selectPatient: (state: AppointmentState, action: PayloadAction<Patient>) => {
    state.formData.patient = action.payload;
    state.searchResults = [];
  },
  selectAppointmentType: (
    state: AppointmentState,
    action: PayloadAction<number>
  ) => {
    state.formData.appointmentTypeId = action.payload;
  },
  resetForm: (state: AppointmentState) => {
    state.formData = initialState.formData;
    state.currentStep = 1;
    state.searchResults = [];
    state.error = null;
    state.validationErrors = {};
  },
};
