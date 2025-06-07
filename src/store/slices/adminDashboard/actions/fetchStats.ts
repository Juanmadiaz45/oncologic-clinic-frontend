import { createAsyncThunk } from '@reduxjs/toolkit';
import patientService from '@/services/api/patientService';
import personalService from '@/services/api/personalService';
import { AdminDashboardStats } from '../types/state';

export const fetchAdminStats = createAsyncThunk(
  'adminDashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const [patients, personal] = await Promise.all([
        patientService.getAllPatients(),
        personalService.getAllPersonal()
      ]);

      const doctors = personal.filter(p => 'medicalLicenseNumber' in p);
      const administrative = personal.filter(p => 'position' in p);

      const stats: AdminDashboardStats = {
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAdministrative: administrative.length,
        totalPersonal: personal.length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return rejectWithValue('Error al cargar estadísticas del sistema');
    }
  }
);