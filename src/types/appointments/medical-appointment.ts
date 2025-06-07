import { BaseEntity } from '../core/api';

// ===== TIPOS BÁSICOS =====
export interface MedicalAppointment extends BaseEntity {
  doctorId: number;
  typeOfMedicalAppointmentId: number;
  appointmentDate: string;
  treatmentId?: number;
  medicalHistoryId: number;
  medicalOfficeIds: number[];
  medicalTaskIds: number[];
}

export interface MedicalTask extends BaseEntity {
  description: string;
  estimatedTime: number; // en minutos
  status: string; // "Completada" | "Pendiente" | "Programada"
  responsible: string;
}

export interface Observation extends BaseEntity {
  content: string;
  recommendation?: string;
  appointmentResultId: number;
}

export interface Treatment extends BaseEntity {
  name: string;
  description: string;
  dateStart: string;
  endDate: string;
  appointmentResultId: number;
  typeOfTreatmentIds: number[];
  prescribedMedicineIds: number[];
  medicalAppointmentIds: number[];
}

export interface PrescribedMedicine extends BaseEntity {
  medicine: string;
  prescriptionDate: string;
  instructions: string;
  dose: string;
  duration: number; // días
  frequencyOfAdministration: string;
  treatmentId: number;
}

export interface AppointmentResult extends BaseEntity {
  evaluationDate: string;
  medicalHistoryId: number;
  observationIds: number[];
  treatmentIds: number[];
}

export interface TypeOfTreatment extends BaseEntity {
  name: string;
  description: string;
  treatmentId: number;
}

// ===== REQUESTS =====
export interface CreateObservationRequest {
  content: string;
  recommendation?: string;
  appointmentResultId: number;
}

export interface CreateTreatmentRequest {
  name: string;
  description: string;
  dateStart: string;
  endDate: string;
  appointmentResultId: number;
}

export interface CreatePrescribedMedicineRequest {
  medicine: string;
  prescriptionDate: string;
  instructions: string;
  dose: string;
  duration: number;
  frequencyOfAdministration: string;
  treatmentId: number;
}

export interface CreateAppointmentResultRequest {
  evaluationDate: string;
  medicalHistoryId: number;
}

export interface UpdateTaskStatusRequest {
  description: string;
  estimatedTime: number;
  status: string;
  responsible: string;
}

// ===== ESTADÍSTICAS =====
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  scheduled: number;
}