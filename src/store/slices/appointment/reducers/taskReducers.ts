import { PayloadAction } from '@reduxjs/toolkit';
import { AppointmentState } from '../types/state';
import { MedicalTask } from '@/types';
import { calculateAppointmentDuration } from '@/utils/appointmentUtils';

export const taskReducers = {
  addMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<MedicalTask>
  ) => {
    state.formData.medicalTasks.push(action.payload);

    // Recalculate duration using the new logic
    const baseDuration = state.formData.medicalTasks.reduce(
      (sum, task) => sum + task.estimatedTime,
      0
    );

    state.formData.baseDuration = baseDuration;
    state.formData.duration = calculateAppointmentDuration(baseDuration, 15);
  },

  removeMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<number>
  ) => {
    state.formData.medicalTasks = state.formData.medicalTasks.filter(
      task => task.id !== action.payload
    );

    // Recalculate duration using the new logic
    const baseDuration = state.formData.medicalTasks.reduce(
      (sum, task) => sum + task.estimatedTime,
      0
    );

    state.formData.baseDuration = baseDuration;
    state.formData.duration = calculateAppointmentDuration(baseDuration, 15);
  },
};
