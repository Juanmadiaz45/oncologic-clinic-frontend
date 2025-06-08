import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import { ReactNode } from 'react';

export interface AppointmentResultDetail {
  id: number;
  evaluationDate: string;
  medicalHistoryId: number;
  observationIds?: number[];
  treatmentIds?: number[];
}

export interface MedicalAppointmentDetail {
  id: number;
  doctorId: number;
  typeOfMedicalAppointmentId: number;
  appointmentDate: string;
  treatmentId?: number;
  medicalHistoryId: number;
  medicalOfficeIds?: number[];
  medicalTaskIds?: number[];
}

export interface MedicalExaminationDetail {
  id: string;
  dateOfRealization: string;
  laboratoryId: number;
  typeOfExamId: number;
  medicalHistoryId: number;
}

export interface ExaminationResultDetail {
  id: number;
  generationDate: string;
  medicalHistoryId: number;
}

type TimelineEventDetails = 
  | MedicalAppointmentDetail 
  | AppointmentResultDetail 
  | MedicalExaminationDetail 
  | ExaminationResultDetail 
  | null;

export interface TimelineEvent {
  id: string;
  type: 'creation' | 'appointment' | 'appointment-result' | 'examination' | 'examination-result';
  title: string;
  description: string;
  date: string;
  icon: ReactNode;
  color: string;
  details?: TimelineEventDetails;
}

class MedicalHistoryDetailsService {
  async getMedicalAppointmentDetails(appointmentId: number): Promise<MedicalAppointmentDetail> {
    return api.get<MedicalAppointmentDetail>(`${API_ENDPOINTS.MEDICAL_APPOINTMENTS}/${appointmentId}`);
  }

  async getAppointmentResultDetails(resultId: number): Promise<AppointmentResultDetail> {
    return api.get<AppointmentResultDetail>(`${API_ENDPOINTS.APPOINTMENT_RESULTS}/${resultId}`);
  }

  async getMedicalExaminationDetails(examinationId: string): Promise<MedicalExaminationDetail> {
    return api.get<MedicalExaminationDetail>(`${API_ENDPOINTS.MEDICAL_EXAMINATIONS}/${examinationId}`);
  }

  async getExaminationResultDetails(resultId: number): Promise<ExaminationResultDetail> {
    return api.get<ExaminationResultDetail>(`${API_ENDPOINTS.EXAMINATION_RESULTS}/${resultId}`);
  }

  async getMedicalHistoryTimeline(
    medicalAppointmentIds: number[],
    appointmentResultIds: number[],
    medicalExaminationIds: string[],
    examinationResultIds: number[],
    historyCreationDate: string
  ): Promise<TimelineEvent[]> {
    console.log('🔍 Obteniendo timeline con fechas reales...');
    
    const events: TimelineEvent[] = [];

    try {
      if (medicalAppointmentIds.length > 0) {
        const appointmentPromises = medicalAppointmentIds.map(id => 
          this.getMedicalAppointmentDetails(id).catch(error => {
            console.warn(`Error fetching appointment ${id}:`, error);
            return null;
          })
        );
        
        const appointments = await Promise.all(appointmentPromises);
        appointments.forEach((appointment, index) => {
          if (appointment) {
            events.push({
              id: `appointment-${appointment.id}`,
              type: 'appointment',
              title: `Cita Médica #${appointment.id}`,
              description: 'Consulta médica programada',
              date: appointment.appointmentDate,
              icon: null,
              color: 'bg-blue-500',
              details: appointment
            });
          } else {
            events.push({
              id: `appointment-${medicalAppointmentIds[index]}`,
              type: 'appointment',
              title: `Cita Médica #${medicalAppointmentIds[index]}`,
              description: 'Consulta médica (fecha no disponible)',
              date: historyCreationDate,
              icon: null,
              color: 'bg-blue-500',
              details: null
            });
          }
        });
      }

      if (appointmentResultIds.length > 0) {
        const resultPromises = appointmentResultIds.map(id => 
          this.getAppointmentResultDetails(id).catch(error => {
            console.warn(`Error fetching appointment result ${id}:`, error);
            return null;
          })
        );
        
        const results = await Promise.all(resultPromises);
        results.forEach((result, index) => {
          if (result) {
            events.push({
              id: `result-${result.id}`,
              type: 'appointment-result',
              title: `Resultado de Consulta #${result.id}`,
              description: 'Evaluación médica completada',
              date: result.evaluationDate,
              icon: null,
              color: 'bg-green-500',
              details: result
            });
          } else {
            events.push({
              id: `result-${appointmentResultIds[index]}`,
              type: 'appointment-result',
              title: `Resultado de Consulta #${appointmentResultIds[index]}`,
              description: 'Evaluación médica (fecha no disponible)',
              date: historyCreationDate,
              icon: null,
              color: 'bg-green-500',
              details: null
            });
          }
        });
      }

      if (medicalExaminationIds.length > 0) {
        const examinationPromises = medicalExaminationIds.map(id => 
          this.getMedicalExaminationDetails(id).catch(error => {
            console.warn(`Error fetching examination ${id}:`, error);
            return null;
          })
        );
        
        const examinations = await Promise.all(examinationPromises);
        examinations.forEach((examination, index) => {
          if (examination) {
            events.push({
              id: `exam-${examination.id}`,
              type: 'examination',
              title: `Examen Médico ${examination.id}`,
              description: 'Estudio médico realizado',
              date: examination.dateOfRealization,
              icon: null,
              color: 'bg-orange-500',
              details: examination
            });
          } else {
            events.push({
              id: `exam-${medicalExaminationIds[index]}`,
              type: 'examination',
              title: `Examen Médico ${medicalExaminationIds[index]}`,
              description: 'Estudio médico (fecha no disponible)',
              date: historyCreationDate,
              icon: null,
              color: 'bg-orange-500',
              details: null
            });
          }
        });
      }

      if (examinationResultIds.length > 0) {
        const examResultPromises = examinationResultIds.map(id => 
          this.getExaminationResultDetails(id).catch(error => {
            console.warn(`Error fetching examination result ${id}:`, error);
            return null;
          })
        );
        
        const examResults = await Promise.all(examResultPromises);
        examResults.forEach((result, index) => {
          if (result) {
            events.push({
              id: `exam-result-${result.id}`,
              type: 'examination-result',
              title: `Resultado de Examen #${result.id}`,
              description: 'Informe de examen disponible',
              date: result.generationDate,
              icon: null,
              color: 'bg-purple-500',
              details: result
            });
          } else {
            events.push({
              id: `exam-result-${examinationResultIds[index]}`,
              type: 'examination-result',
              title: `Resultado de Examen #${examinationResultIds[index]}`,
              description: 'Informe de examen (fecha no disponible)',
              date: historyCreationDate,
              icon: null,
              color: 'bg-purple-500',
              details: null
            });
          }
        });
      }

      events.push({
        id: 'creation',
        type: 'creation',
        title: 'Creación del Historial Médico',
        description: 'Se registró el historial médico del paciente',
        date: historyCreationDate,
        icon: null,
        color: 'bg-clinic-500',
        details: null
      });

      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      console.log(`✅ Timeline obtenido: ${events.length} eventos`);
      return events;

    } catch (error) {
      console.error('❌ Error obteniendo timeline:', error);
      throw new Error('Error al obtener los detalles del timeline médico');
    }
  }
}

const medicalHistoryDetailsService = new MedicalHistoryDetailsService();
export default medicalHistoryDetailsService;