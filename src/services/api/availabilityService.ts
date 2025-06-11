import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import { addMinutes, format, parseISO } from 'date-fns';

export interface CreateAvailabilityRequest {
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  personalIds: number[];
  statusId: number;
}

class AvailabilityService {
  async createAvailability(data: CreateAvailabilityRequest): Promise<void> {
    console.log('🔍 Creando availability:', data);
    await api.post(API_ENDPOINTS.AVAILABILITIES, data);
    console.log('✅ Availability creada exitosamente');
  }

  async createDoctorBusyAvailability(
    doctorId: number,
    appointmentDate: string,
    durationMinutes: number
  ): Promise<void> {
    // Calculate end time
    const startTime = parseISO(appointmentDate);

    // Add minutes
    const endTime = addMinutes(startTime, durationMinutes);

    const availabilityData: CreateAvailabilityRequest = {
      startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),
      personalIds: [doctorId],
      statusId: 2,
    };
    await this.createAvailability(availabilityData);
  }
}

const availabilityService = new AvailabilityService();
export default availabilityService;
