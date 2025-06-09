import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import medicalTaskService from '@/services/api/medicalTaskService';
import { API_ENDPOINTS } from '@/constants';
import {
  DoctorResponseDTO,
  Availability,
  MedicalOffice,
  TimeSlot,
  CreateAppointmentRequest,
  CreateMedicalTaskRequest,
  MedicalTask,
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
export const getPersonalAvailabilities = createAsyncThunk(
  'appointment/getPersonalAvailabilities',
  async (doctorId: number) => {
    const availabilities = await api.get<Availability[]>(
      API_ENDPOINTS.PERSONAL_AVAILABILITIES.replace(
        ':personalId',
        doctorId.toString()
      )
    );
    return availabilities;
  }
);

// Generate time slots for a specific date based on doctor availabilities
export const generateTimeSlots = createAsyncThunk(
  'appointment/generateTimeSlots',
  async (params: {
    date: string;
    duration: number;
    availabilities: Availability[];
  }) => {
    const { date, duration, availabilities } = params;

    // Calculate available time slots based only on doctor availabilities
    const timeSlots = calculateAvailableTimeSlots(
      date,
      duration,
      availabilities
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
      API_ENDPOINTS.MEDICAL_APPOINTMENTS,
      appointmentData
    );
    return response;
  }
);

// Crear tareas médicas para la cita
export const createMedicalTasksForAppointment = createAsyncThunk(
  'appointment/createMedicalTasksForAppointment',
  async (tasks: CreateMedicalTaskRequest[]) => {
    if (tasks.length === 0) return [];

    console.log('🔍 Creando tareas médicas para la cita:', tasks);
    const createdTasks = await medicalTaskService.createMedicalTasks(tasks);
    console.log('✅ Tareas médicas creadas con IDs:', createdTasks);
    return createdTasks;
  }
);

// Crear la cita médica con las tareas ya creadas
export const createAppointmentWithTasks = createAsyncThunk(
  'appointment/createAppointmentWithTasks',
  async (params: {
    appointmentData: CreateAppointmentRequest;
    templateTasks: MedicalTask[];
    customTasks: CreateMedicalTaskRequest[];
  }) => {
    const { appointmentData, templateTasks, customTasks } = params;

    // 1. Crear tareas médicas personalizadas (si las hay)
    let createdCustomTasks: MedicalTask[] = [];
    if (customTasks.length > 0) {
      createdCustomTasks = await medicalTaskService.createMedicalTasks(
        customTasks
      );
    }

    // 2. Crear tareas médicas basadas en las plantillas
    const templateTasksToCreate: CreateMedicalTaskRequest[] = templateTasks.map(
      task => ({
        description: task.description,
        estimatedTime: task.estimatedTime,
        status: task.status || 'PENDIENTE',
        responsible: task.responsible,
      })
    );

    let createdTemplateTasks: MedicalTask[] = [];
    if (templateTasksToCreate.length > 0) {
      createdTemplateTasks = await medicalTaskService.createMedicalTasks(
        templateTasksToCreate
      );
    }

    // 3. Combinar todos los IDs de tareas creadas
    const allTaskIds = [
      ...createdTemplateTasks.map(task => task.id),
      ...createdCustomTasks.map(task => task.id),
    ];

    console.log('🔍 IDs de tareas para vincular a la cita:', allTaskIds);

    // 4. Crear la cita médica con los IDs de las tareas
    const finalAppointmentData = {
      ...appointmentData,
      medicalTaskIds: allTaskIds,
    };

    console.log(
      '🔍 Creando cita médica con datos finales:',
      finalAppointmentData
    );
    const response = await api.post(
      API_ENDPOINTS.MEDICAL_APPOINTMENTS,
      finalAppointmentData
    );

    return {
      appointment: response,
      createdTasks: [...createdTemplateTasks, ...createdCustomTasks],
    };
  }
);

// Helper function to calculate available time slots based on doctor availabilities
function calculateAvailableTimeSlots(
  date: string,
  durationMinutes: number,
  availabilities: Availability[]
): TimeSlot[] {
  // Horario laboral: 6 AM a 8 PM (6:00 - 20:00)
  const workDayStart = 6 * 60; // 6:00 AM en minutos
  const workDayEnd = 20 * 60; // 8:00 PM en minutos

  // Filtrar availabilities que coincidan con la fecha seleccionada
  const dayAvailabilities = availabilities.filter(avail =>
    isDateInRange(date, avail.startTime, avail.endTime)
  );

  // Crear períodos ocupados basados en las availabilities
  const occupiedPeriods = dayAvailabilities.map(avail => ({
    start: parseTime(avail.startTime),
    end: parseTime(avail.endTime),
  }));

  // Ordenar y fusionar períodos ocupados superpuestos
  const mergedOccupiedPeriods = mergeOverlappingPeriods(occupiedPeriods);

  const timeSlots: TimeSlot[] = [];

  // Generar slots de 15 minutos en el horario laboral
  for (
    let current = workDayStart;
    current + durationMinutes <= workDayEnd;
    current += 15
  ) {
    const slotStart = current;
    const slotEnd = current + durationMinutes;

    // Verificar si el slot completo está libre (no se superpone con ningún período ocupado)
    const isSlotFree = !mergedOccupiedPeriods.some(
      occupied => slotStart < occupied.end && slotEnd > occupied.start
    );

    timeSlots.push({
      startTime: formatTime(slotStart),
      endTime: formatTime(slotEnd),
      available: isSlotFree,
    });
  }

  return timeSlots;
}

// Helper function to merge overlapping time periods
function mergeOverlappingPeriods(
  periods: Array<{ start: number; end: number }>
): Array<{ start: number; end: number }> {
  if (periods.length === 0) return [];

  // Ordenar períodos por hora de inicio
  const sorted = periods.sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    // Si el período actual se superpone o toca el último período fusionado
    if (current.start <= lastMerged.end) {
      lastMerged.end = Math.max(lastMerged.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

// Helper function to check if a date falls within an availability range
function isDateInRange(
  date: string,
  startDateTime: string,
  endDateTime: string
): boolean {
  const targetDate = new Date(date);
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  return targetDate >= startDate && targetDate <= endDate;
}

// Helper functions
function parseTime(timeStr: string): number {
  // Si timeStr es un datetime completo, extraer solo la hora
  const timeOnly = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr;
  const [hours, minutes] = timeOnly.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
}
