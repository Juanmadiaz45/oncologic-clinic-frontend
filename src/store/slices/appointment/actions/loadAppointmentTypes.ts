import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import { MedicalAppointment } from '@/types';
import { AppointmentType } from '@/types';
import { API_ENDPOINTS } from '@/constants';

export const loadAppointmentTypes = createAsyncThunk(
  'appointment/loadAppointmentTypes',
  async () => {
    // First we get the base appointments
    const baseAppointments = await api.get<MedicalAppointment[]>(
      `${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/base`
    );

    // We get the unique types
    const typeIds = [
      ...new Set(
        baseAppointments.map(
          appointment => appointment.typeOfMedicalAppointmentId
        )
      ),
    ];

    // Fetch appointment types
    const queryString = typeIds.map(id => `ids=${id}`).join('&');
    const appointmentTypes = await api.get<AppointmentType[]>(
      `${API_ENDPOINTS.APPOINTMENT_TYPES}/by-ids?${queryString}`
    );

    return {
      baseAppointments,
      appointmentTypes,
    };
  }
);
