// src/services/dashboard/dashboardService.ts
import { api } from '@/services/api/client';
import { DashboardData, DashboardMetrics, AppointmentSummary, NextAppointment } from '@/types/dashboard';

// Tipos que coinciden exactamente con el backend
interface BackendDashboardMetrics {
  appointmentsToday: number;
  activePatients: number;
  pendingObservations: number;
  currentDate: string;
  currentDay: string;
}

interface BackendAppointmentSummary {
  id: number;
  time: string;
  patientName: string;
  appointmentType: string;
  status: string;
  office: string;
}

interface BackendNextAppointment {
  time: string;
  patientName: string;
  office: string;
  appointmentType: string;
}

class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      // CORREGIDO: Agregar /api/ al inicio
      const response = await api.get<BackendDashboardMetrics>('/doctor-dashboard/metrics');
      
      // Transformar la respuesta del backend al formato del frontend
      return {
        appointmentsToday: response.appointmentsToday,
        activePatients: response.activePatients,
        pendingResults: response.pendingObservations, // Mapear a pendingResults
        emergencies: 0, // No existe en el backend
        currentDate: response.currentDate,
        currentDay: response.currentDay
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw new Error('No se pudieron obtener las métricas del dashboard');
    }
  }

  async getTodayAppointments(): Promise<AppointmentSummary[]> {
    try {
      // CORREGIDO: Agregar /api/ al inicio
      const appointments = await api.get<BackendAppointmentSummary[]>('/doctor-dashboard/appointments/today');
      
      // Transformar la respuesta del backend
      return appointments.map(appointment => ({
        id: appointment.id,
        time: appointment.time,
        patientName: appointment.patientName,
        appointmentType: appointment.appointmentType,
        status: this.mapAppointmentStatus(appointment.status),
        office: appointment.office
      }));
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      throw new Error('No se pudieron obtener las citas de hoy');
    }
  }

  private mapAppointmentStatus(backendStatus: string): AppointmentSummary['status'] {
    switch (backendStatus) {
      case 'SCHEDULED':
        return 'SCHEDULED';
      case 'IN_PROGRESS':
        return 'IN_PROGRESS';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return 'SCHEDULED';
    }
  }

  async getNextAppointment(): Promise<NextAppointment | null> {
    try {
      // CORREGIDO: Agregar /api/ al inicio
      const nextAppointment = await api.get<BackendNextAppointment>('/doctor-dashboard/appointments/next');
      return nextAppointment;
    } catch (error: unknown) {
      // Si no hay próxima cita, el backend devuelve 404, lo cual es normal
      if (error instanceof Error) {
        console.error('Error fetching next appointment:', error);
        throw new Error('No se pudo obtener la próxima cita');
      }
      throw error;
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const [metrics, todayAppointments, nextAppointment] = await Promise.all([
        this.getMetrics(),
        this.getTodayAppointments(),
        this.getNextAppointment()
      ]);

      return {
        metrics,
        todayAppointments,
        pendingTasks: [], // Eliminamos las tareas pendientes
        nextAppointment
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Método deprecado pero mantenido para compatibilidad
  /*async updateTaskStatus(taskId: number, completed: boolean): Promise<void> {
    console.warn('updateTaskStatus is deprecated - pending tasks were removed');
  }*/

  async createQuickAppointment(appointmentData: unknown): Promise<void> {
    try {
      await api.post('/medical-appointments', appointmentData);
    } catch (error) {
      console.error('Error creating quick appointment:', error);
      throw new Error('No se pudo crear la cita');
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;