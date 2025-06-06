export interface MedicalHistory {
  id: number;
  patientId: number;
  creationDate: string; // ISO 8601 format
  currentHealthStatus: string;
  medicalAppointmentIds: number[];
  medicalExaminationIds: string[];
  appointmentResultIds: number[];
  examinationResultIds: number[];
}
