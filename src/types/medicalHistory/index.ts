import { BaseEntity } from '../core/api';

export interface MedicalHistoryResponse extends BaseEntity {
  patientId: number;
  creationDate: string;
  currentHealthStatus: string;
  medicalAppointmentIds: number[];
  medicalExaminationIds: string[];
  appointmentResultIds: number[];
  examinationResultIds: number[];
}

export interface MedicalHistoryStats {
  totalAppointments: number;
  totalExaminations: number;
  totalAppointmentResults: number;
  totalExaminationResults: number;
}

export interface MedicalAppointmentSummary extends BaseEntity {
  doctorName: string;
  appointmentType: string;
  appointmentDate: string;
  status: string;
}

export interface MedicalExaminationSummary {
  id: string;
  dateOfRealization: string;
  laboratoryName: string;
  examType: string;
  status: string;
}

export interface AppointmentResultSummary extends BaseEntity {
  evaluationDate: string;
  observationsCount: number;
}

export interface ExaminationResultSummary extends BaseEntity {
  generationDate: string;
  examType: string;
}