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
