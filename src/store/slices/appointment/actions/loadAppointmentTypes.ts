import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import { MedicalAppointment } from '@/types';
import { AppointmentType } from '@/types';

export const loadAppointmentTypes = createAsyncThunk(
  'appointment/loadAppointmentTypes',
  async () => {
    // First we get the base appointments
    const baseAppointments = await api.get<MedicalAppointment[]>(
      '/medical-appointments/base'
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
      `/medical-appointment-types/by-ids?${queryString}`
    );

    return {
      baseAppointments,
      appointmentTypes,
    };
  }
);
