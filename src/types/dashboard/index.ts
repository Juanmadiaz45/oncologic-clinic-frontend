import { BaseEntity } from '../core/api';

export interface DashboardMetrics {
  appointmentsToday: number;
  activePatients: number;
  //pendingResults: number; // Corresponde a pendingObservations del backend
  //emergencies: number; // Se mantiene pero siempre será 0
  currentDate: string;
  currentDay: string;
}

export interface AppointmentSummary extends BaseEntity {
  time: string;
  patientName: string;
  appointmentType: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  office?: string;
  duration?: number;
}

export interface PendingTask extends BaseEntity {
  description: string;
  patientName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'BIOPSY' | 'PROTOCOL' | 'FOLLOW_UP' | 'CALL';
  completed: boolean;
}

export interface NextAppointment {
  id: number; // Agregado para poder navegar a la cita médica
  time: string;
  patientName: string;
  office: string;
  appointmentType: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  todayAppointments: AppointmentSummary[];
  pendingTasks?: PendingTask[]; // Array vacío por ahora
  nextAppointment: NextAppointment | null;
}