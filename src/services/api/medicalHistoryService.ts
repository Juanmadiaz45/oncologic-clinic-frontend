import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import { MedicalHistoryResponse } from '@/types/medicalHistory';
import { PatientResponse } from '@/types/patients/extended';

class MedicalHistoryService {
  async getMedicalHistoryByPatientId(patientId: number): Promise<MedicalHistoryResponse> {
    console.log('🔍 Obteniendo historial médico para paciente ID:', patientId);
    
    const patient = await api.get<PatientResponse>(`/users/patients/${patientId}`);
    console.log('👤 Datos del paciente:', patient);
    
    if (!patient.medicalHistory || !patient.medicalHistory.id) {
      throw new Error('Este paciente no tiene historial médico registrado');
    }
    
    const historyId = patient.medicalHistory.id;
    console.log('🏥 ID del historial médico:', historyId);
    
    const historyData = await api.get<MedicalHistoryResponse>(`${API_ENDPOINTS.MEDICAL_HISTORY}/${historyId}`);
    console.log('📋 Datos del historial completo:', historyData);
    
    return historyData;
  }

  async getMedicalHistoryById(historyId: number): Promise<MedicalHistoryResponse> {
    return api.get<MedicalHistoryResponse>(`${API_ENDPOINTS.MEDICAL_HISTORY}/${historyId}`);
  }

  async updateHealthStatus(historyId: number, healthStatus: string): Promise<void> {
    return api.put(`${API_ENDPOINTS.MEDICAL_HISTORY}/${historyId}`, {
      currentHealthStatus: healthStatus
    });
  }
}

const medicalHistoryService = new MedicalHistoryService();
export default medicalHistoryService;