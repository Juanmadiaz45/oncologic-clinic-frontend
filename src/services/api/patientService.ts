import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import { PaginatedResponse } from '@/types/core/api';
import {
  PatientResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/types/patients/extended';

class PatientService {
  // Get all patients
  async getAllPatients(): Promise<PatientResponse[]> {
    return api.get<PatientResponse[]>(API_ENDPOINTS.PATIENTS);
  }

  // Get patient by ID
  async getPatientById(id: number): Promise<PatientResponse> {
    return api.get<PatientResponse>(`${API_ENDPOINTS.PATIENTS}/${id}`);
  }

  // Create new patient
  async createPatient(data: CreatePatientRequest): Promise<PatientResponse> {
    return api.post<PatientResponse>(API_ENDPOINTS.PATIENTS, data);
  }

  // Update patient
  async updatePatient(id: number, data: UpdatePatientRequest): Promise<PatientResponse> {
    return api.put<PatientResponse>(`${API_ENDPOINTS.PATIENTS}/${id}`, data);
  }

  // Delete patient
  async deletePatient(id: number): Promise<void> {
    return api.delete(`${API_ENDPOINTS.PATIENTS}/${id}`);
  }

  // Get patients paginated (if needed)
  async getPatientsPaginated(
    page: number,
    size: number,
    search?: string
  ): Promise<PaginatedResponse<PatientResponse>> {
    const params: Record<string, unknown> = { page, size };
    if (search) params.search = search;
    
    return api.get<PaginatedResponse<PatientResponse>>(
      `${API_ENDPOINTS.PATIENTS}/paginated`,
      params
    );
  }
}

const patientService = new PatientService();
export default patientService;