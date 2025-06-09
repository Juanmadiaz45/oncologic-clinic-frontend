export interface CreateMedicalTaskRequest {
  description: string;
  estimatedTime: number;
  status: string;
  responsible: string;
}

export interface MedicalTask extends CreateMedicalTaskRequest {
  id: number;
}
