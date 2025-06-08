import { createAsyncThunk } from '@reduxjs/toolkit';
import medicalHistoryService from '@/services/api/medicalHistoryService';
import medicalHistoryDetailsService from '@/services/api/medicalHistoryDetailsService';
import { RootState } from '@/store';

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

export const fetchTimelineWithRealDates = createAsyncThunk(
  'medicalHistory/fetchTimelineWithRealDates',
  async (medicalHistoryId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const medicalHistory = state.medicalHistory.medicalHistory;
      
      if (!medicalHistory || medicalHistory.id !== medicalHistoryId) {
        throw new Error('No se encontró el historial médico o no coincide el ID');
      }

      const timelineEvents = await medicalHistoryDetailsService.getMedicalHistoryTimeline(
        medicalHistory.medicalAppointmentIds,
        medicalHistory.appointmentResultIds,
        medicalHistory.medicalExaminationIds,
        medicalHistory.examinationResultIds,
        medicalHistory.creationDate
      );
      
      return timelineEvents;
    } catch (error) {
      console.error('Error fetching timeline with real dates:', error);
      return rejectWithValue('Error al cargar las fechas reales del timeline');
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