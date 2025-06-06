import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';

export const saveAppointment = createAsyncThunk(
  'appointment/saveAppointment',
  async (appointmentData: unknown) => {
    const savedAppointment = await api.post(
      '/medical-appointments',
      appointmentData
    );
    return savedAppointment;
  }
);
