import { Patient } from '@/types';
import { MedicalTask } from '@/types';

export interface AppointmentFormData {
  // Step 1
  patient: Patient | null;
  appointmentTypeId: number | null;
  baseAppointmentId: number | null;
  baseDuration: number; // Base duration without buffering or rounding
  duration: number; // Final duration with buffer and rounding to X min
  medicalTasks: MedicalTask[];

  // Step 2
  appointmentDate?: string;
  appointmentTime?: string;
  medicalOfficeId?: number;
  notes?: string;
}
