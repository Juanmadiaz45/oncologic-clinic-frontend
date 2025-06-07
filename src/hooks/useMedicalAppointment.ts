import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

import {
  MedicalAppointment,
  MedicalTask,
  Observation,
  Treatment,
  TypeOfTreatment,
  CreateObservationRequest,
  CreateTreatmentRequest,
  TaskStatus
} from '@/types/appointments/medicalAppointmentTypesPage';
import medicalAppointmentService from '@/services/medical-appointment/medicalAppointmentService';
import authService from '@/services/auth/authService';

interface UseMedicalAppointmentReturn {
  appointment: MedicalAppointment | null;
  tasks: MedicalTask[];
  observations: Observation[];
  treatments: Treatment[];
  treatmentTypes: TypeOfTreatment[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startAppointment: () => Promise<void>;
  completeAppointment: () => Promise<void>;
  toggleTaskCompletion: (taskId: number, completed: boolean) => Promise<void>;
  createObservation: (data: CreateObservationRequest) => Promise<void>;
  createTreatment: (data: CreateTreatmentRequest) => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Computed
  allTasksCompleted: boolean;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const useMedicalAppointment = (appointmentId: number): UseMedicalAppointmentReturn => {
  const [appointment, setAppointment] = useState<MedicalAppointment | null>(null);
  const [tasks, setTasks] = useState<MedicalTask[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentTypes, setTreatmentTypes] = useState<TypeOfTreatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!authService.isAuthenticated()) {
        throw new Error('Usuario no autenticado');
      }

      const [
        appointmentDetails,
        tasksData,
        observationsData,
        treatmentsData,
        treatmentTypesData
      ] = await Promise.all([
        medicalAppointmentService.getAppointmentDetails(appointmentId),
        medicalAppointmentService.getAppointmentTasks(appointmentId),
        medicalAppointmentService.getAppointmentObservations(appointmentId),
        medicalAppointmentService.getAppointmentTreatments(appointmentId),
        medicalAppointmentService.getTreatmentTypes()
      ]);

      setAppointment(appointmentDetails);
      setTasks(tasksData);
      setObservations(observationsData);
      setTreatments(treatmentsData);
      setTreatmentTypes(treatmentTypesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos de la cita médica';
      setError(errorMessage);
      console.error('Error loading appointment data:', err);
      
      if (
        errorMessage.includes('autenticado') || (err as AxiosError)?.response?.status === 401
      ) {
        authService.logout();
      } 

    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  const startAppointment = useCallback(async () => {
    try {
      await medicalAppointmentService.startAppointment(appointmentId);
      await loadData();
    } catch (err) {
      setError('Error al iniciar la cita médica');
      console.error('Error starting appointment:', err);
    }
  }, [appointmentId, loadData]);

  const completeAppointment = useCallback(async () => {
    try {
      await medicalAppointmentService.completeAppointment(appointmentId);
      await loadData();
    } catch (err) {
      setError('Error al completar la cita médica');
      console.error('Error completing appointment:', err);
    }
  }, [appointmentId, loadData]);

  const toggleTaskCompletion = useCallback(async (taskId: number, completed: boolean) => {
    try {
      const status = completed ? 'COMPLETADA' : 'PENDIENTE';
      await medicalAppointmentService.updateTaskStatus(taskId, { status });
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
      task.id === taskId
        ? { ...task, status: status as TaskStatus, completed }
        : task
        )
      );
    } catch (err) {
      setError('Error al actualizar el estado de la tarea');
      console.error('Error updating task status:', err);
      // Revertir el estado optimista
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: task.status, completed: !completed } : task
        )
      );
    }
  }, []);

  const createObservation = useCallback(async (data: CreateObservationRequest) => {
    try {
      const newObservation = await medicalAppointmentService.createObservation(data);
      setObservations(prev => [newObservation, ...prev]);
    } catch (err) {
      setError('Error al crear la observación');
      console.error('Error creating observation:', err);
      throw err;
    }
  }, []);

  const createTreatment = useCallback(async (data: CreateTreatmentRequest) => {
    try {
      const newTreatment = await medicalAppointmentService.createTreatment(data);
      setTreatments(prev => [newTreatment, ...prev]);
    } catch (err) {
      setError('Error al crear el tratamiento');
      console.error('Error creating treatment:', err);
      throw err;
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  useEffect(() => {
    if (appointmentId > 0) {
      loadData();
    }
  }, [loadData, appointmentId]);

  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.status === 'COMPLETADA');
  const completedTasksCount = tasks.filter(task => task.status === 'COMPLETADA').length;
  const totalTasksCount = tasks.length;

  return {
    appointment,
    tasks,
    observations,
    treatments,
    treatmentTypes,
    isLoading,
    error,
    startAppointment,
    completeAppointment,
    toggleTaskCompletion,
    createObservation,
    createTreatment,
    refreshData,
    allTasksCompleted,
    completedTasksCount,
    totalTasksCount
  };
};