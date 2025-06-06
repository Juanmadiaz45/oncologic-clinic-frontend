import { PayloadAction } from '@reduxjs/toolkit';
import { AppointmentState } from '../types/state';

export const errorReducers = {
  // Error handling
  setError: (state: AppointmentState, action: PayloadAction<string | null>) => {
    state.error = action.payload;
  },

  // Validation errors
  setValidationErrors: (
    state: AppointmentState,
    action: PayloadAction<Record<string, string>>
  ) => {
    state.validationErrors = action.payload;
  },

  clearValidationErrors: (state: AppointmentState) => {
    state.validationErrors = {};
  },
};
