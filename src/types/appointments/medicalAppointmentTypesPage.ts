import { BaseEntity } from '../core/api';

export type TaskStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

// ===== BASIC TYPES =====
export interface MedicalAppointment extends BaseEntity {
  doctorId: number;
  typeOfMedicalAppointmentId: number;
  appointmentDate: string;
  treatmentId?: number;
  medicalHistoryId: number;
  patientId: number;
  patientName: string;
  doctorName: string;
  officeName: string;
  appointmentType: string;
  status: string;
}

export interface MedicalTask extends BaseEntity {
  description: string;
  estimatedTime?: number;
  status: TaskStatus;
  responsible: string;
  completed?: boolean;
}

export interface Observation extends BaseEntity {
  content: string;
  recommendation?: string;
  appointmentResultId: number;
  createdAt: string;
}

export interface Treatment extends BaseEntity {
  name?: string;
  description: string;
  dateStart: string;
  endDate?: string;
  appointmentResultId: number;
  typeOfTreatmentId?: number;
  typeOfTreatmentName?: string;
}

export interface PrescribedMedicine extends BaseEntity {
  medicine: string;
  prescriptionDate: string;
  instructions: string;
  dose: string;
  duration: number;
  frequencyOfAdministration: string;
  treatmentId: number;
}

export interface TypeOfTreatment extends BaseEntity {
  name: string;
  description: string;
}

// ===== REQUESTS =====
export interface CreateObservationRequest {
  content: string;
  recommendation?: string;
  medicalAppointmentId: number;
}

export interface CreateTreatmentRequest {
  name?: string;
  description: string;
  dateStart: string;
  endDate?: string;
  medicalAppointmentId: number;
  patientId: number;
}

export interface CreatePrescribedMedicineRequest {
  medicine: string;
  instructions: string;
  dose: string;
  duration: string;
  frequencyOfAdministration: string;
  treatmentId: number;
}

export interface UpdateTaskStatusRequest {
  status: string;
}