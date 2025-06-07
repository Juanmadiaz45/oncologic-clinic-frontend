// src/store/slices/appointment/reducers/taskReducers.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { AppointmentState } from '../types/state';
import { MedicalTask } from '@/types';

export const taskReducers = {
  addMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<MedicalTask>
  ) => {
    state.formData.medicalTasks.push(action.payload);
    const totalTaskTime = state.formData.medicalTasks.reduce(
      (sum, task) => sum + (task.estimatedTime || 0),
      0
    );
    state.formData.duration = totalTaskTime + Math.ceil(totalTaskTime * 0.15);
  },
  removeMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<number>
  ) => {
    state.formData.medicalTasks = state.formData.medicalTasks.filter(
      task => task.id !== action.payload
    );
    const totalTaskTime = state.formData.medicalTasks.reduce(
      (sum, task) => sum + (task.estimatedTime || 0),
      0
    );
    state.formData.duration = totalTaskTime + Math.ceil(totalTaskTime * 0.15);
  },
};
