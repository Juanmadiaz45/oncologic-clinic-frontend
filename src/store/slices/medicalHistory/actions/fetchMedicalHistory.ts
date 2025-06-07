import { createAsyncThunk } from '@reduxjs/toolkit';
import medicalHistoryService from '@/services/api/medicalHistoryService';

export const fetchMedicalHistory = createAsyncThunk(
  'medicalHistory/fetchMedicalHistory',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const medicalHistory = await medicalHistoryService.getMedicalHistoryByPatientId(patientId);
      return { medicalHistory, patientId };
    } catch (error) {
      console.error('Error fetching medical history:', error);
      return rejectWithValue('Error al cargar el historial médico del paciente');
    }
  }
);

export const updateHealthStatus = createAsyncThunk(
  'medicalHistory/updateHealthStatus',
  async (params: { historyId: number; healthStatus: string }, { rejectWithValue }) => {
    try {
      await medicalHistoryService.updateHealthStatus(params.historyId, params.healthStatus);
      return params.healthStatus;
    } catch (error) {
      console.error('Error updating health status:', error);
      return rejectWithValue('Error al actualizar el estado de salud');
    }
  }
);