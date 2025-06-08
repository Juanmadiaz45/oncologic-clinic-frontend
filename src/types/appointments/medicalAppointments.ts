export interface MedicalAppointment {
  id: number;
  doctorId: number;
  typeOfMedicalAppointmentId: number;
  appointmentDate: string;
  treatmentId: number | null;
  medicalHistoryId: number;
  medicalOfficeId: number;
  medicalTaskIds: number[];
}

export interface CreateAppointmentRequest {
  doctorId: number;
  patientId: number;
  typeOfMedicalAppointmentId: number;
  appointmentDate: string; // 'YYYY-MM-DDTHH:mm:ss'
  medicalOfficeId: number;
  notes?: string;
}
