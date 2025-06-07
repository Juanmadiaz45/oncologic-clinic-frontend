import { api } from '@/services/api/client'; // Usar el cliente existente
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
} from '@/types/appointments/medicalAppointmentTypesPage';

class MedicalAppointmentService {
  // ===== CITA MÉDICA =====
  async getAppointmentDetails(appointmentId: number): Promise<MedicalAppointment> {
    return api.get<MedicalAppointment>(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/details`);
  }

  async startAppointment(appointmentId: number): Promise<void> {
    return api.patch(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/start`);
  }

  async completeAppointment(appointmentId: number): Promise<void> {
    return api.patch(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/complete`);
  }

  // ===== TAREAS MÉDICAS =====
  async getAppointmentTasks(appointmentId: number): Promise<MedicalTask[]> {
    const tasks = await api.get<MedicalTask[]>(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/tasks`);
    return tasks.map((task: MedicalTask) => ({
      ...task,
      completed: task.status === 'COMPLETADA'
    }));
  }

  async updateTaskStatus(taskId: number, data: { status: string }): Promise<MedicalTask> {
    return api.put<MedicalTask>(`${API_ENDPOINTS.MEDICAL_TASKS}/${taskId}`, {
      description: 'Tarea actualizada',
      estimatedTime: 30,
      status: data.status,
      responsible: 'Doctor',
      medicalAppointmentIds: []
    });
  }

  // ===== OBSERVACIONES =====
  async getAppointmentObservations(appointmentId: number): Promise<Observation[]> {
    return api.get<Observation[]>(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/observations`);
  }

  async createObservation(data: CreateObservationRequest): Promise<Observation> {
    const appointmentResult = await api.get(
      `${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${data.medicalAppointmentId}/appointment-result`
    );
    
    const observationData = {
      content: data.content,
      recommendation: data.recommendation,
      appointmentResultId: appointmentResult.id
    };
    
    return api.post<Observation>(API_ENDPOINTS.OBSERVATIONS, observationData);
  }

  // ===== TRATAMIENTOS =====
  async getAppointmentTreatments(appointmentId: number): Promise<Treatment[]> {
    return api.get<Treatment[]>(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}/treatments`);
  }

  async createTreatment(data: CreateTreatmentRequest): Promise<Treatment> {
    const appointmentResult = await api.get(
      `${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${data.medicalAppointmentId}/appointment-result`
    );
    
    // Formato correcto según TreatmentRequestDTO del backend
    const treatmentData = {
      name: data.name || 'Tratamiento',
      description: data.description,
      dateStart: data.dateStart + 'T00:00:00', // Formato ISO completo
      endDate: data.endDate ? data.endDate + 'T23:59:59' : undefined,
      appointmentResultId: appointmentResult.id
    };
    
    return api.post<Treatment>(API_ENDPOINTS.TREATMENTS, treatmentData);
  }

  async getTreatmentTypes(): Promise<TypeOfTreatment[]> {
    return api.get<TypeOfTreatment[]>(API_ENDPOINTS.TREATMENT_TYPES);
  }

  // ===== MEDICINAS PRESCRITAS =====
  async getTreatmentMedicines(treatmentId: number): Promise<PrescribedMedicine[]> {
    return api.get<PrescribedMedicine[]>(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/1/treatments/${treatmentId}/medicines`);
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
    
    return api.post<PrescribedMedicine>(API_ENDPOINTS.PRESCRIBED_MEDICINES, medicineData);
  }
}

const medicalAppointmentService = new MedicalAppointmentService();
export default medicalAppointmentService;