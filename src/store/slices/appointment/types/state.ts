import { AppointmentFormData } from './formData';
import { Patient } from '@/types';
import { MedicalTask } from '@/types';
import { AppointmentType } from '@/types';
import { MedicalAppointment } from '@/types';
import { initialStep2Data } from './step2Data';

export interface AppointmentState {
  // Form data
  formData: AppointmentFormData;
  currentStep: number;

  // Loading states
  isSearchingPatients: boolean;
  isLoadingTypes: boolean;
  isCalculatingDuration: boolean;
  isSaving: boolean;

  // Step 2 loading states
  isSearchingDoctors: boolean;
  isLoadingDoctors: boolean;
  isLoadingTimeSlots: boolean;
  isLoadingOffices: boolean;
  isCreatingAppointment: boolean;

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
    appointmentTypeName: null,
    baseAppointmentId: null,
    baseDuration: 0,
    duration: 0,
    medicalTasks: [],
    customMedicalTasks: [],
    step2: initialStep2Data,
  },
  currentStep: 1,
  isSearchingPatients: false,
  isLoadingTypes: false,
  isCalculatingDuration: false,
  isSaving: false,
  isSearchingDoctors: false,
  isLoadingDoctors: false,
  isLoadingTimeSlots: false,
  isLoadingOffices: false,
  isCreatingAppointment: false,
  searchResults: [],
  appointmentTypes: [],
  baseAppointments: [],
  availableTasks: [],
  error: null,
  validationErrors: {},
};
