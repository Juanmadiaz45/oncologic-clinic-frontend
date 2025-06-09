// src/store/slices/appointment/reducers/taskReducers.ts (actualización)
import { PayloadAction } from '@reduxjs/toolkit';
import { AppointmentState } from '../types/state';
import { MedicalTask, CreateMedicalTaskRequest } from '@/types';
import { calculateAppointmentDuration } from '@/utils/appointmentUtils';

export const taskReducers = {
  addMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<MedicalTask>
  ) => {
    state.formData.medicalTasks.push(action.payload);

    // Recalculate duration using the new logic
    const baseDuration =
      state.formData.medicalTasks.reduce(
        (sum, task) => sum + task.estimatedTime,
        0
      ) +
      state.formData.customMedicalTasks.reduce(
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
    const baseDuration =
      state.formData.medicalTasks.reduce(
        (sum, task) => sum + task.estimatedTime,
        0
      ) +
      state.formData.customMedicalTasks.reduce(
        (sum, task) => sum + task.estimatedTime,
        0
      );

    state.formData.baseDuration = baseDuration;
    state.formData.duration = calculateAppointmentDuration(baseDuration, 15);
  },

  // Nuevos reducers para tareas personalizadas
  addCustomMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<CreateMedicalTaskRequest>
  ) => {
    state.formData.customMedicalTasks.push(action.payload);

    // Recalculate duration
    const baseDuration =
      state.formData.medicalTasks.reduce(
        (sum, task) => sum + task.estimatedTime,
        0
      ) +
      state.formData.customMedicalTasks.reduce(
        (sum, task) => sum + task.estimatedTime,
        0
      );

    state.formData.baseDuration = baseDuration;
    state.formData.duration = calculateAppointmentDuration(baseDuration, 15);
  },

  removeCustomMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<number>
  ) => {
    state.formData.customMedicalTasks =
      state.formData.customMedicalTasks.filter(
        (_, index) => index !== action.payload
      );

    // Recalculate duration
    const baseDuration =
      state.formData.medicalTasks.reduce(
        (sum, task) => sum + task.estimatedTime,
        0
      ) +
      state.formData.customMedicalTasks.reduce(
        (sum, task) => sum + task.estimatedTime,
        0
      );

    state.formData.baseDuration = baseDuration;
    state.formData.duration = calculateAppointmentDuration(baseDuration, 15);
  },

  updateCustomMedicalTask: (
    state: AppointmentState,
    action: PayloadAction<{ index: number; task: CreateMedicalTaskRequest }>
  ) => {
    const { index, task } = action.payload;
    if (index >= 0 && index < state.formData.customMedicalTasks.length) {
      state.formData.customMedicalTasks[index] = task;

      // Recalculate duration
      const baseDuration =
        state.formData.medicalTasks.reduce(
          (sum, task) => sum + task.estimatedTime,
          0
        ) +
        state.formData.customMedicalTasks.reduce(
          (sum, task) => sum + task.estimatedTime,
          0
        );

      state.formData.baseDuration = baseDuration;
      state.formData.duration = calculateAppointmentDuration(baseDuration, 15);
    }
  },
};
