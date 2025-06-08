import { BaseEntity } from '../core/api';

export interface MedicalHistoryDetail extends BaseEntity {
  patientId: number;
  creationDate: string;
  currentHealthStatus: string;
  
  medicalAppointments?: MedicalAppointmentSummary[];
  appointmentResults?: AppointmentResultDetail[];
  treatments?: TreatmentDetail[];
  medicalExaminations?: MedicalExaminationSummary[];
  
  medicalAppointmentIds?: number[];
  appointmentResultIds?: number[];
  examinationResultIds?: number[];
  medicalExaminationIds?: string[];
}

export interface MedicalAppointmentSummary extends BaseEntity {
  doctorName: string;
  appointmentType: string;
  appointmentDate: string;
  status: string;
}

export interface AppointmentResultDetail extends BaseEntity {
  evaluationDate: string;
  observations: ObservationDetail[];
  treatments: TreatmentSummary[];
}

export interface ObservationDetail extends BaseEntity {
  content: string;
  recommendation: string;
}

export interface TreatmentDetail extends BaseEntity {
  name: string;
  description: string;
  dateStart: string;
  endDate: string;
  prescribedMedicines: PrescribedMedicineDetail[];
  typeOfTreatments: TypeOfTreatmentDetail[];
}

export interface TreatmentSummary extends BaseEntity {
  name: string;
  dateStart: string;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
}

export interface PrescribedMedicineDetail extends BaseEntity {
  medicine: string;
  prescriptionDate: string;
  instructions: string;
  dose: string;
  duration: number;
  frequencyOfAdministration: string;
}

export interface TypeOfTreatmentDetail extends BaseEntity {
  name: string;
  description: string;
}

export interface MedicalExaminationSummary {
  id: string;
  dateOfRealization: string;
  laboratoryName: string;
  examType: string;
  status: string;
}