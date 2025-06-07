import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import { Patient } from '@/types';

export const searchPatients = createAsyncThunk(
  'appointment/searchPatients',
  async (idNumber: string) => {
    if (!idNumber.trim()) return [];

    const patients = await api.get<Patient[]>(
      `/users/patients?id_number=${idNumber}`
    );
    return patients;
  }
);
