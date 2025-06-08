import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants';
import {
  DoctorResponseDTO,
  DoctorAvailability,
  MedicalOffice,
  TimeSlot,
  CreateAppointmentRequest,
} from '@/types';

// Search doctors by name
export const searchDoctors = createAsyncThunk(
  'appointment/searchDoctors',
  async (searchTerm: string) => {
    if (!searchTerm.trim()) return [];

    const doctors = await api.get<DoctorResponseDTO[]>(
      `${API_ENDPOINTS.DOCTORS_SEARCH}?name=${encodeURIComponent(searchTerm)}`
    );
    return doctors;
  }
);

// Get doctors by speciality
export const getDoctorsBySpeciality = createAsyncThunk(
  'appointment/getDoctorsBySpeciality',
  async (specialityId: number) => {
    const doctors = await api.get<DoctorResponseDTO[]>(
      `${API_ENDPOINTS.DOCTORS_BY_SPECIALITY}/${specialityId}`
    );
    return doctors;
  }
);

// Get doctor availabilities
export const getDoctorAvailabilities = createAsyncThunk(
  'appointment/getDoctorAvailabilities',
  async (doctorId: number) => {
    const availabilities = await api.get<DoctorAvailability[]>(
      API_ENDPOINTS.DOCTOR_AVAILABILITIES.replace(
        ':doctorId',
        doctorId.toString()
      )
    );
    return availabilities;
  }
);

// Generate time slots for a specific date
export const generateTimeSlots = createAsyncThunk(
  'appointment/generateTimeSlots',
  async (params: {
    doctorId: number;
    date: string;
    duration: number;
    availabilities: DoctorAvailability[];
  }) => {
    const { doctorId, date, duration, availabilities } = params;

    // Get existing appointments for the doctor on that date
    const existingAppointments = await api.get<
      Array<{
        startTime: string;
        endTime: string;
      }>
    >(`/medical-appointments/doctor/${doctorId}/date/${date}`);

    // Calculate available time slots based on availabilities and existing appointments
    const timeSlots = calculateAvailableTimeSlots(
      date,
      duration,
      availabilities,
      existingAppointments
    );

    return timeSlots;
  }
);

// Get available offices for a time slot
export const getAvailableOffices = createAsyncThunk(
  'appointment/getAvailableOffices',
  async (params: { date: string; startTime: string; endTime: string }) => {
    const offices = await api.post<MedicalOffice[]>(
      API_ENDPOINTS.MEDICAL_OFFICES_AVAILABLE,
      params
    );
    return offices;
  }
);

// Create the appointment
export const createAppointment = createAsyncThunk(
  'appointment/createAppointment',
  async (appointmentData: CreateAppointmentRequest) => {
    const response = await api.post(
      API_ENDPOINTS.SCHEDULE_APPOINTMENT,
      appointmentData
    );
    return response;
  }
);

// Helper function to calculate available time slots
function calculateAvailableTimeSlots(
  date: string,
  durationMinutes: number,
  availabilities: DoctorAvailability[],
  existingAppointments: Array<{ startTime: string; endTime: string }>
): TimeSlot[] {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase();

  // Find availability for the selected day
  const dayAvailability = availabilities.find(
    avail => avail.dayOfWeek === dayOfWeek && avail.status === 'A'
  );

  if (!dayAvailability) return [];

  const timeSlots: TimeSlot[] = [];
  const startTime = parseTime(dayAvailability.startTime);
  const endTime = parseTime(dayAvailability.endTime);

  // Generate 15-minute intervals
  for (
    let current = startTime;
    current + durationMinutes <= endTime;
    current += 15
  ) {
    const slotStart = formatTime(current);
    const slotEnd = formatTime(current + durationMinutes);

    // Check if this slot conflicts with existing appointments
    const hasConflict = existingAppointments.some(appointment => {
      const appointmentStart = parseTime(appointment.startTime);
      const appointmentEnd = parseTime(appointment.endTime);
      return (
        current < appointmentEnd && current + durationMinutes > appointmentStart
      );
    });

    timeSlots.push({
      startTime: slotStart,
      endTime: slotEnd,
      available: !hasConflict,
    });
  }

  return timeSlots;
}

// Helper functions
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
}
