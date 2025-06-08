import { Patient } from '@/types';
import { MedicalTask } from '@/types';
import { AppointmentStep2Data } from './step2Data';

export interface AppointmentFormData {
  // Step 1
  patient: Patient | null;
  appointmentTypeId: number | null;
  appointmentTypeName: string | null;
  baseAppointmentId: number | null;
  baseDuration: number; // Base duration without buffering or rounding
  duration: number; // Final duration with buffer and rounding to X min
  medicalTasks: MedicalTask[];

  // Step 2
  step2: AppointmentStep2Data;
}
