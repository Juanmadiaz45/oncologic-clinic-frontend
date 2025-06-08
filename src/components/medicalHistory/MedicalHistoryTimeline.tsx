import React from 'react';
import { 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon,
  BeakerIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';
import { MedicalHistoryDetail } from '@/types/medicalHistory';

interface MedicalHistoryTimelineProps {
  medicalHistory: MedicalHistoryDetail;
}

interface TimelineEvent {
  id: string;
  date: string;
  type: 'appointment' | 'result' | 'examination' | 'treatment';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({ 
  medicalHistory 
}) => {
  const timelineEvents: TimelineEvent[] = [];
  if (medicalHistory.medicalAppointmentIds && medicalHistory.medicalAppointmentIds.length > 0) {
    medicalHistory.medicalAppointmentIds.forEach((appointmentId, index) => {
      timelineEvents.push({
        id: `appointment-${appointmentId}`,
        date: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        type: 'appointment' as const,
        title: `Cita Médica #${appointmentId}`,
        description: 'Consulta médica registrada',
        icon: <CalendarDaysIcon className="h-5 w-5" />,
        color: 'bg-blue-500'
      });
    });
  }

  // Eventos basados en IDs de resultados de citas
  if (medicalHistory.appointmentResultIds && medicalHistory.appointmentResultIds.length > 0) {
    medicalHistory.appointmentResultIds.forEach((resultId, index) => {
      timelineEvents.push({
        id: `result-${resultId}`,
        date: new Date(Date.now() - (index * 5 * 24 * 60 * 60 * 1000)).toISOString(), // Fechas estimadas
        type: 'result' as const,
        title: `Resultado de Consulta #${resultId}`,
        description: 'Resultado médico registrado',
        icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
        color: 'bg-green-500'
      });
    });
  }

  if (medicalHistory.medicalExaminationIds && medicalHistory.medicalExaminationIds.length > 0) {
    medicalHistory.medicalExaminationIds.forEach((examId, index) => {
      timelineEvents.push({
        id: `exam-${examId}`,
        date: new Date(Date.now() - (index * 3 * 24 * 60 * 60 * 1000)).toISOString(),
        type: 'examination' as const,
        title: `Examen Médico ${examId}`,
        description: 'Examen médico realizado',
        icon: <BeakerIcon className="h-5 w-5" />,
        color: 'bg-orange-500'
      });
    });
  }

  if (medicalHistory.appointmentResultIds && medicalHistory.appointmentResultIds.length > 0) {
    medicalHistory.appointmentResultIds.forEach((resultId, index) => {
      timelineEvents.push({
        id: `treatment-${resultId}`,
        date: new Date(Date.now() - (index * 4 * 24 * 60 * 60 * 1000)).toISOString(),
        type: 'treatment' as const,
        title: `Tratamiento asociado a resultado #${resultId}`,
        description: 'Tratamiento médico indicado',
        icon: <HeartIcon className="h-5 w-5" />,
        color: 'bg-purple-500'
      });
    });
  }

  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Línea de Tiempo Médica</h3>
      
      {timelineEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-lg font-medium text-gray-400">Sin eventos médicos registrados</p>
          <p className="text-sm text-gray-400 mt-1">Los eventos aparecerán aquí cuando se registren</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium">📋 Resumen del historial:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span>• {medicalHistory.medicalAppointmentIds?.length || 0} citas médicas</span>
            <span>• {medicalHistory.appointmentResultIds?.length || 0} resultados</span>
            <span>• {medicalHistory.medicalExaminationIds?.length || 0} exámenes</span>
            <span>• {medicalHistory.examinationResultIds?.length || 0} análisis</span>
          </div>
        </div>
      )}
      
      <div className="flow-root">
        <ul className="-mb-8">
          {timelineEvents.slice(0, 10).map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== Math.min(timelineEvents.length - 1, 9) ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`${event.color} h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}>
                      <div className="text-white">
                        {event.icon}
                      </div>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.description}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={event.date}>
                        {formatDate(event.date)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {timelineEvents.length > 10 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            ... y {timelineEvents.length - 10} eventos más
          </div>
        )}
      </div>
    </div>
  );
};