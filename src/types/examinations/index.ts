// Examination Types
export interface TypeOfExam {
  id: number;
  name: string;
  description: string;
}

export interface Laboratory {
  id: number;
  name: string;
  location: string;
  telephone: string;
}

export interface MedicalExamination {
  id: string;
  dateOfRealization: string;
  laboratoryId: number;
  laboratoryName?: string;
  laboratoryLocation?: string;
  laboratoryTelephone?: string;
  typeOfExamId: number;
  typeOfExamName?: string;
  typeOfExamDescription?: string;
  medicalHistoryId: number;
  patientName?: string;
}

export interface ExaminationResult {
  id: number;
  generationDate: string;
  medicalHistoryId: number;
  hasReport: boolean;
  reportSizeBytes?: number;
  reportFormat?: string;
  reportContent?: string; // Contenido del reporte para mostrar
}

// Request DTOs
export interface CreateMedicalExaminationRequest {
  dateOfRealization: string; // formato: YYYY-MM-DDTHH:mm:ss
  laboratoryId: number;
  typeOfExamId: number;
}

export interface CreateExaminationResultRequest {
  medicalHistoryId: number;
  generationDate: string;
  resultsReport: File | null;
}

// Response DTOs with full details
export interface MedicalExaminationWithResults {
  examination: MedicalExamination;
  results: ExaminationResult[];
}