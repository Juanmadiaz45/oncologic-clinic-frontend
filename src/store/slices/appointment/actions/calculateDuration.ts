import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import { MedicalAppointment } from '@/types';
import { MedicalTask } from '@/types';

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

    // Calculate total duration with 15% buffer
    const totalTaskTime = tasks.reduce(
      (sum, task) => sum + task.estimatedTime,
      0
    );
    const bufferTime = Math.ceil(totalTaskTime * 0.15);
    const totalDuration = totalTaskTime + bufferTime;

    return {
      baseAppointmentId: baseMedicalAppointment.id,
      duration: totalDuration,
      medicalTasks: tasks,
    };
  }
);
