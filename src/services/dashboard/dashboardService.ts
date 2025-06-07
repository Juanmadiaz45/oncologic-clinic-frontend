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
  id: number;
  time: string;
  patientName: string;
  office: string;
  appointmentType: string;
}

class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await api.get<BackendDashboardMetrics>('/doctor-dashboard/metrics');
      
      return {
        appointmentsToday: response.appointmentsToday || 0,
        activePatients: response.activePatients || 0,
        pendingResults: response.pendingObservations || 0,
        currentDate: response.currentDate || new Date().getDate().toString(),
        currentDay: response.currentDay || new Date().toLocaleDateString('es-ES', { weekday: 'long' })
      };
    } catch (error) {
      console.warn('Error fetching dashboard metrics, using defaults:', error);
      // Devolver valores por defecto en lugar de lanzar error
      return {
        appointmentsToday: 0,
        activePatients: 0,
        pendingResults: 0,
        currentDate: new Date().getDate().toString(),
        currentDay: new Date().toLocaleDateString('es-ES', { weekday: 'long' })
      };
    }
  }

  async getTodayAppointments(): Promise<AppointmentSummary[]> {
    try {
      const appointments = await api.get<BackendAppointmentSummary[]>('/doctor-dashboard/appointments/today');
      
      return appointments.map(appointment => ({
        id: appointment.id,
        time: appointment.time,
        patientName: appointment.patientName,
        appointmentType: appointment.appointmentType,
        status: this.mapAppointmentStatus(appointment.status),
        office: appointment.office
      }));
    } catch (error) {
      console.warn('Error fetching today appointments, returning empty array:', error);
      // Devolver array vacío en lugar de lanzar error
      return [];
    }
  }

  async getNextAppointment(): Promise<NextAppointment | null> {
    try {
      const nextAppointment = await api.get<BackendNextAppointment>('/doctor-dashboard/appointments/next');
      return nextAppointment;
    } catch (error: unknown) {
      // Verificar si error es del tipo esperado (por ejemplo, de Axios)
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };

        if (axiosError.response?.status === 404 || axiosError.response?.status === 204) {
          console.info('No next appointment found');
          return null;
        }
      }

      console.warn('Error fetching next appointment:', error);
      return null;
    }

  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      // Ejecutar todas las llamadas y manejar errores individualmente
      const [metrics, todayAppointments, nextAppointment] = await Promise.allSettled([
        this.getMetrics(),
        this.getTodayAppointments(),
        this.getNextAppointment()
      ]);

      return {
        metrics: metrics.status === 'fulfilled' ? metrics.value : {
          appointmentsToday: 0,
          activePatients: 0,
          pendingResults: 0,
          currentDate: new Date().getDate().toString(),
          currentDay: new Date().toLocaleDateString('es-ES', { weekday: 'long' })
        },
        todayAppointments: todayAppointments.status === 'fulfilled' ? todayAppointments.value : [],
        nextAppointment: nextAppointment.status === 'fulfilled' ? nextAppointment.value : null
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Incluso si todo falla, devolver estructura básica
      return {
        metrics: {
          appointmentsToday: 0,
          activePatients: 0,
          pendingResults: 0,
          currentDate: new Date().getDate().toString(),
          currentDay: new Date().toLocaleDateString('es-ES', { weekday: 'long' })
        },
        todayAppointments: [],
        nextAppointment: null
      };
    }
  }

  // Resto de métodos sin cambios...
  private mapAppointmentStatus(backendStatus: string): AppointmentSummary['status'] {
    switch (backendStatus) {
      case 'SCHEDULED':
      case 'PENDIENTE':
        return 'SCHEDULED';
      case 'IN_PROGRESS':
      case 'EN_PROGRESO':
        return 'IN_PROGRESS';
      case 'COMPLETED':
      case 'COMPLETADA':
        return 'COMPLETED';
      case 'CANCELLED':
      case 'CANCELADA':
        return 'CANCELLED';
      default:
        return 'SCHEDULED';
    }
  }

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