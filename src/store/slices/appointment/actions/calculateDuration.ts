// src/store/slices/appointment/actions/calculateDuration.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import { MedicalAppointment } from '@/types';
import { MedicalTask } from '@/types';
import { calculateAppointmentDuration } from '@/utils/appointmentUtils';

export const calculateDuration = createAsyncThunk(
  'appointment/calculateDuration',
  async (params: {
    typeId: number;
    baseAppointments: MedicalAppointment[];
  }) => {
    const { typeId, baseAppointments } = params;

    // Find the base appointment for this type
    const baseMedicalAppointment = baseAppointments.find(
      appointment => appointment.typeOfMedicalAppointmentId === typeId
    );

    if (!baseMedicalAppointment) {
      throw new Error('Base appointment not found');
    }

    // Get medical tasks
    const taskIds = baseMedicalAppointment.medicalTaskIds;
    const tasks = await api.get<MedicalTask[]>(
      `/medical-tasks/by-ids?ids=${taskIds.join(',')}`
    );

    // Calculate base duration (sum of all tasks)
    const baseDuration = tasks.reduce(
      (sum, task) => sum + task.estimatedTime,
      0
    );

    // Calculate final duration with buffer and rounding to 15-minute blocks
    const finalDuration = calculateAppointmentDuration(baseDuration, 15);

    return {
      baseAppointmentId: baseMedicalAppointment.id,
      baseDuration, // Original duration without buffering or rounding
      duration: finalDuration, // Final duration with buffer and rounding
      medicalTasks: tasks,
    };
  }
);
