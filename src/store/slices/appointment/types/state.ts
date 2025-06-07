import { AppointmentFormData } from './formData';
import { Patient } from '@/types';
import { MedicalTask } from '@/types';
import { AppointmentType } from '@/types';
import { MedicalAppointment } from '@/types';

export interface AppointmentState {
  // Form data
  formData: AppointmentFormData;
  currentStep: number;

  // Loading states
  isSearchingPatients: boolean;
  isLoadingTypes: boolean;
  isCalculatingDuration: boolean;
  isSaving: boolean;

  // Data lists
  searchResults: Patient[];
  appointmentTypes: AppointmentType[];
  baseAppointments: MedicalAppointment[];
  availableTasks: MedicalTask[];

  // Error handling
  error: string | null;
  validationErrors: Record<string, string>;
}

export const initialState: AppointmentState = {
  formData: {
    patient: null,
    appointmentTypeId: null,
    baseAppointmentId: null,
    baseDuration: 0, // New property
    duration: 0,
    medicalTasks: [],
  },
  currentStep: 1,
  isSearchingPatients: false,
  isLoadingTypes: false,
  isCalculatingDuration: false,
  isSaving: false,
  searchResults: [],
  appointmentTypes: [],
  baseAppointments: [],
  availableTasks: [],
  error: null,
  validationErrors: {},
};
