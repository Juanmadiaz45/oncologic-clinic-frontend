import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api/client';
import medicalTaskService from '@/services/api/medicalTaskService';
import availabilityService from '@/services/api/availabilityService';
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

    // Calculate available time slots based on doctor availabilities
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

// Create the medical appointment with the tasks already created
export const createAppointmentWithTasks = createAsyncThunk(
  'appointment/createAppointmentWithTasks',
  async (params: {
    appointmentData: CreateAppointmentRequest;
    templateTasks: MedicalTask[];
    customTasks: CreateMedicalTaskRequest[];
    appointmentDuration: number;
  }) => {
    const { appointmentData, templateTasks, customTasks, appointmentDuration } =
      params;

    // 1. Create custom medical tasks (if any)
    let createdCustomTasks: MedicalTask[] = [];
    if (customTasks.length > 0) {
      createdCustomTasks = await medicalTaskService.createMedicalTasks(
        customTasks
      );
    }

    // 2. Create medical tasks based on templates
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

    // 3. Merge all created task IDs
    const allTaskIds = [
      ...createdTemplateTasks.map(task => task.id),
      ...createdCustomTasks.map(task => task.id),
    ];

    console.log('🔍 IDs de tareas para vincular a la cita:', allTaskIds);

    // 4. Create the medical appointment with the task IDs
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

    // 5. Create availability to mark the doctor as busy
    await availabilityService.createDoctorBusyAvailability(
      appointmentData.doctorId,
      appointmentData.appointmentDate,
      appointmentDuration
    );

    return {
      appointment: response,
      createdTasks: [...createdTemplateTasks, ...createdCustomTasks],
    };
  }
);

// New function to calculate free periods between busy periods
function calculateFreePeriods(
  workStart: number,
  workEnd: number,
  occupiedPeriods: Array<{ start: number; end: number }>
): Array<{ start: number; end: number }> {
  const freePeriods: Array<{ start: number; end: number }> = [];

  if (occupiedPeriods.length === 0) {
    // If there are no busy periods, the whole day is free
    return [{ start: workStart, end: workEnd }];
  }

  // Sort busy periods by start time
  const sortedOccupied = [...occupiedPeriods].sort((a, b) => a.start - b.start);

  let currentStart = workStart;

  for (const occupied of sortedOccupied) {
    // If there is free space before the occupied period
    if (currentStart < occupied.start) {
      freePeriods.push({
        start: currentStart,
        end: occupied.start,
      });
    }

    // Move the start to the end of the busy period
    currentStart = Math.max(currentStart, occupied.end);
  }

  // If there is free time after the last busy period
  if (currentStart < workEnd) {
    freePeriods.push({
      start: currentStart,
      end: workEnd,
    });
  }

  return freePeriods;
}

// Improved Helper function to merge overlapping periods
function mergeOverlappingPeriods(
  periods: Array<{ start: number; end: number }>
): Array<{ start: number; end: number }> {
  if (periods.length === 0) return [];

  // Sort periods by start time
  const sorted = [...periods].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    // If the current period overlaps or touches the last merged period
    if (current.start <= lastMerged.end) {
      lastMerged.end = Math.max(lastMerged.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function isDateInAvailabilityRange(
  targetDate: string,
  startDateTime: string,
  endDateTime: string
): boolean {
  console.log('🗓️ isDateInAvailabilityRange - Comparando:', {
    targetDate,
    startDateTime,
    endDateTime,
  });

  const target = new Date(targetDate + 'T00:00:00');
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const targetDateOnly = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const startDateOnly = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDateOnly = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  console.log('🗓️ isDateInAvailabilityRange - Fechas normalizadas:', {
    targetDateOnly: targetDateOnly.toISOString().split('T')[0],
    startDateOnly: startDateOnly.toISOString().split('T')[0],
    endDateOnly: endDateOnly.toISOString().split('T')[0],
  });

  const isInRange =
    targetDateOnly >= startDateOnly && targetDateOnly <= endDateOnly;
  console.log('🗓️ isDateInAvailabilityRange - Resultado:', isInRange);

  return isInRange;
}

// Helper function to extract only the time from a datetime
function extractTimeFromDateTime(dateTimeStr: string): number {
  const date = new Date(dateTimeStr);
  const minutes = date.getHours() * 60 + date.getMinutes();
  console.log('🕒 extractTimeFromDateTime:', {
    input: dateTimeStr,
    hours: date.getHours(),
    minutes: date.getMinutes(),
    totalMinutes: minutes,
  });
  return minutes;
}

// Helper function to format time from minutes
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const formatted = `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
  console.log('🕒 formatTime:', { minutes, hours, mins, formatted });
  return formatted;
}

// Helper function to calculate available time slots based on doctor availabilities
function calculateAvailableTimeSlots(
  date: string,
  durationMinutes: number,
  availabilities: Availability[]
): TimeSlot[] {
  // Working hours: 6 AM to 8 PM (6:00 - 20:00)
  const workDayStart = 6 * 60; // 6:00 AM
  const workDayEnd = 20 * 60; // 8:00 PM
  const slotInterval = 15; // 15-minute intervals

  // Filter availabilities that match the selected date
  const dayAvailabilities = availabilities.filter(avail => {
    const isInRange = isDateInAvailabilityRange(
      date,
      avail.startTime,
      avail.endTime
    );
    return isInRange;
  });

  // Create BUSY periods based on availabilities
  const occupiedPeriods = dayAvailabilities.map(avail => {
    const start = extractTimeFromDateTime(avail.startTime);
    const end = extractTimeFromDateTime(avail.endTime);

    return { start, end };
  });

  // Sort and merge overlapping busy periods
  const mergedOccupiedPeriods = mergeOverlappingPeriods(occupiedPeriods);

  // Calculate FREE periods among those employed
  const freePeriods = calculateFreePeriods(
    workDayStart,
    workDayEnd,
    mergedOccupiedPeriods
  );

  const timeSlots: TimeSlot[] = [];

  // Generate slots for the entire working schedule in 15-minute intervals
  for (
    let current = workDayStart;
    current + durationMinutes <= workDayEnd;
    current += slotInterval
  ) {
    const slotStart = current;
    const slotEnd = current + durationMinutes;

    // Check if the full slot fits into any free period
    const isSlotAvailable = freePeriods.some(freePeriod => {
      const fitsInFreePeriod =
        slotStart >= freePeriod.start && slotEnd <= freePeriod.end;

      return fitsInFreePeriod;
    });

    timeSlots.push({
      startTime: formatTime(slotStart),
      endTime: formatTime(slotEnd),
      available: isSlotAvailable,
    });
  }

  const availableCount = timeSlots.filter(slot => slot.available).length;
  console.log('📊 Resumen de slots generados:', {
    totalSlots: timeSlots.length,
    availableSlots: availableCount,
    unavailableSlots: timeSlots.length - availableCount,
    date,
    duration: durationMinutes,
  });

  return timeSlots;
}
