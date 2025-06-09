import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import { CreateMedicalTaskRequest, MedicalTask } from '@/types';

class MedicalTaskService {
  async createMedicalTask(
    data: CreateMedicalTaskRequest
  ): Promise<MedicalTask> {
    console.log('🔍 Creando tarea médica:', data);
    const response = await api.post<MedicalTask>(
      API_ENDPOINTS.MEDICAL_TASKS,
      data
    );
    console.log('✅ Tarea médica creada:', response);
    return response;
  }

  async createMedicalTasks(
    tasks: CreateMedicalTaskRequest[]
  ): Promise<MedicalTask[]> {
    console.log('🔍 Creando múltiples tareas médicas:', tasks.length);
    const createdTasks = await Promise.all(
      tasks.map(task => this.createMedicalTask(task))
    );
    console.log('✅ Tareas médicas creadas:', createdTasks);
    return createdTasks;
  }

  async getMedicalTaskById(id: number): Promise<MedicalTask> {
    return api.get<MedicalTask>(`${API_ENDPOINTS.MEDICAL_TASKS}/${id}`);
  }

  async updateMedicalTask(
    id: number,
    data: Partial<CreateMedicalTaskRequest>
  ): Promise<MedicalTask> {
    return api.put<MedicalTask>(`${API_ENDPOINTS.MEDICAL_TASKS}/${id}`, data);
  }

  async deleteMedicalTask(id: number): Promise<void> {
    return api.delete(`${API_ENDPOINTS.MEDICAL_TASKS}/${id}`);
  }
}

const medicalTaskService = new MedicalTaskService();
export default medicalTaskService;
