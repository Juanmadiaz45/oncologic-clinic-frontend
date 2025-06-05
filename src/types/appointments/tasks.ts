import { BaseEntity } from '../core/api';

// Tipos para las tareas de las citas médicas
export interface AppointmentTask extends BaseEntity {
  description: string;
  completed: boolean;
  priority: TaskPriority;
  estimatedTime?: string;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
  medicalAppointmentId: number;
}

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CreateTaskRequest {
  description: string;
  priority: TaskPriority;
  estimatedTime?: string;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
  medicalAppointmentId: number;
}

export interface UpdateTaskRequest {
  description?: string;
  completed?: boolean;
  priority?: TaskPriority;
  estimatedTime?: string;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
}

// Estadísticas de tareas
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}