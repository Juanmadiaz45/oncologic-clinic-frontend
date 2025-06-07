import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import { MedicalHistoryDetail } from '@/types/medicalHistory';
import { PatientResponse } from '@/types/patients/extended'; // ← Importar el tipo

class MedicalHistoryService {
  async getMedicalHistoryByPatientId(patientId: number): Promise<MedicalHistoryDetail> {
    console.log('🔍 Obteniendo paciente con ID:', patientId);
    const patient = await api.get<PatientResponse>(`/users/patients/${patientId}`);
    console.log('👤 Datos del paciente:', patient);
    
    if (!patient.medicalHistory || !patient.medicalHistory.id) {
      throw new Error('Este paciente no tiene historial médico registrado');
    }
    
    console.log('🏥 ID del historial médico:', patient.medicalHistory.id);
    const historyData = await this.getMedicalHistoryById(patient.medicalHistory.id);
    console.log('📋 Datos del historial completo:', historyData);
    
    return historyData;
  }

  async getMedicalHistoryById(historyId: number): Promise<MedicalHistoryDetail> {
    return api.get<MedicalHistoryDetail>(`${API_ENDPOINTS.MEDICAL_HISTORY}/${historyId}`);
  }

  async updateHealthStatus(historyId: number, healthStatus: string): Promise<void> {
    return api.put(`${API_ENDPOINTS.MEDICAL_HISTORY}/${historyId}`, {
      currentHealthStatus: healthStatus
    });
  }
}

const medicalHistoryService = new MedicalHistoryService();
export default medicalHistoryService;