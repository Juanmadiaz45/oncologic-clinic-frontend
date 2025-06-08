import {
  DoctorResponseDTO,
  DoctorAvailability,
  MedicalOffice,
  TimeSlot,
} from '@/types';

export interface AppointmentStep2Data {
  // Doctor selection
  selectedDoctor: DoctorResponseDTO | null;
  availableDoctors: DoctorResponseDTO[];
  doctorSearchTerm: string;
  selectedSpecialityId: number | null;

  // Date and time selection
  selectedDate: string | null; // 'YYYY-MM-DD'
  selectedTimeSlot: TimeSlot | null;
  availableTimeSlots: TimeSlot[];
  doctorAvailabilities: DoctorAvailability[];

  // Office selection
  selectedOfficeId: number | null;
  availableOffices: MedicalOffice[];

  // Additional
  notes: string;
}

export const initialStep2Data: AppointmentStep2Data = {
  selectedDoctor: null,
  availableDoctors: [],
  doctorSearchTerm: '',
  selectedSpecialityId: null,
  selectedDate: null,
  selectedTimeSlot: null,
  availableTimeSlots: [],
  doctorAvailabilities: [],
  selectedOfficeId: null,
  availableOffices: [],
  notes: '',
};
