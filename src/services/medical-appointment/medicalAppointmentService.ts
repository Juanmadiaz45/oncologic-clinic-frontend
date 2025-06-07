import axios from 'axios';
import { API_ENDPOINTS } from '@/constants';
import {
  MedicalAppointment,
  MedicalTask,
  Observation,
  Treatment,
  PrescribedMedicine,
  TypeOfTreatment,
  CreateObservationRequest,
  CreateTreatmentRequest,
  CreatePrescribedMedicineRequest
} from '@/types/medical-appointment';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/g5/siscom',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class MedicalAppointmentService {
  // ===== CITA MÉDICA =====
  async getAppointmentDetails(appointmentId: number): Promise<MedicalAppointment> {
    const response = await api.get(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/details`);
    return response.data;
  }

  async startAppointment(appointmentId: number): Promise<void> {
    await api.patch(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/start`);
  }

  async completeAppointment(appointmentId: number): Promise<void> {
    await api.patch(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/complete`);
  }

  // ===== TAREAS MÉDICAS =====
  async getAppointmentTasks(appointmentId: number): Promise<MedicalTask[]> {
    const response = await api.get(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/tasks`);
    return response.data.map((task: MedicalTask) => ({
      ...task,
      completed: task.status === 'COMPLETADA'
    }));
  }

  async updateTaskStatus(taskId: number, data: { status: string }): Promise<MedicalTask> {
    const response = await api.put(`${API_ENDPOINTS.MEDICAL_TASKS}/${taskId}`, {
      description: 'Tarea actualizada',
      estimatedTime: 30,
      status: data.status,
      responsible: 'Doctor',
      medicalAppointmentIds: []
    });
    return response.data;
  }

  // ===== OBSERVACIONES =====
  async getAppointmentObservations(appointmentId: number): Promise<Observation[]> {
    const response = await api.get(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/observations`);
    return response.data;
  }

  async createObservation(data: CreateObservationRequest): Promise<Observation> {
    const appointmentResultResponse = await api.get(
      `${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${data.medicalAppointmentId}/appointment-result`
    );
    
    const observationData = {
      content: data.content,
      recommendation: data.recommendation,
      appointmentResultId: appointmentResultResponse.data.id
    };
    
    const response = await api.post(API_ENDPOINTS.OBSERVATIONS, observationData);
    return response.data;
  }

  // ===== TRATAMIENTOS =====
  async getAppointmentTreatments(appointmentId: number): Promise<Treatment[]> {
    const response = await api.get(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/treatments`);
    return response.data;
  }

  async createTreatment(data: CreateTreatmentRequest): Promise<Treatment> {
    const appointmentResultResponse = await api.get(
      `${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${data.medicalAppointmentId}/appointment-result`
    );
    
    // Formato correcto según TreatmentRequestDTO del backend
    const treatmentData = {
      name: data.name || 'Tratamiento',
      description: data.description,
      dateStart: data.dateStart + 'T00:00:00', // Formato ISO completo
      endDate: data.endDate ? data.endDate + 'T23:59:59' : undefined,
      appointmentResultId: appointmentResultResponse.data.id
    };
    
    const response = await api.post(API_ENDPOINTS.TREATMENTS, treatmentData);
    return response.data;
  }

  async getTreatmentTypes(): Promise<TypeOfTreatment[]> {
    const response = await api.get(API_ENDPOINTS.TREATMENT_TYPES);
    return response.data;
  }

  // ===== MEDICINAS PRESCRITAS =====
  async getTreatmentMedicines(treatmentId: number): Promise<PrescribedMedicine[]> {
    const response = await api.get(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/1/treatments/${treatmentId}/medicines`);
    return response.data;
  }

  async createPrescribedMedicine(data: CreatePrescribedMedicineRequest): Promise<PrescribedMedicine> {
    const medicineData = {
      medicine: data.medicine,
      prescriptionDate: new Date().toISOString(),
      instructions: data.instructions,
      dose: data.dose,
      duration: parseInt(data.duration) || 7,
      frequencyOfAdministration: data.frequencyOfAdministration,
      treatmentId: data.treatmentId
    };
    
    const response = await api.post(API_ENDPOINTS.PRESCRIBED_MEDICINES, medicineData);
    return response.data;
  }
}

const medicalAppointmentService = new MedicalAppointmentService();
export default medicalAppointmentService;