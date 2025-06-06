import { PayloadAction } from '@reduxjs/toolkit';
import { AppointmentState } from '../types/state';

export const stepReducers = {
  // Navigation between steps
  setCurrentStep: (state: AppointmentState, action: PayloadAction<number>) => {
    state.currentStep = action.payload;
  },

  nextStep: (state: AppointmentState) => {
    state.currentStep += 1;
  },

  previousStep: (state: AppointmentState) => {
    if (state.currentStep > 1) {
      state.currentStep -= 1;
    }
  },
};
