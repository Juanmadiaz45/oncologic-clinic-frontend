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

export const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({ 
  medicalHistory 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Combine all timeline events
  const timelineEvents = [
    ... (medicalHistory.medicalAppointments ?? []).map(appointment => ({
      id: `appointment-${appointment.id}`,
      date: appointment.appointmentDate,
      type: 'appointment' as const,
      title: `Cita Médica - ${appointment.appointmentType}`,
      description: `Dr. ${appointment.doctorName}`,
      icon: <CalendarDaysIcon className="h-5 w-5" />,
      color: 'bg-blue-500'
    })),
    ...medicalHistory.appointmentResults.map(result => ({
      id: `result-${result.id}`,
      date: result.evaluationDate,
      type: 'result' as const,
      title: 'Resultado de Consulta',
      description: `${result.observations.length} observaciones registradas`,
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
      color: 'bg-green-500'
    })),
    ...medicalHistory.treatments.map(treatment => ({
      id: `treatment-${treatment.id}`,
      date: treatment.dateStart,
      type: 'treatment' as const,
      title: `Tratamiento: ${treatment.name}`,
      description: treatment.description,
      icon: <HeartIcon className="h-5 w-5" />,
      color: 'bg-purple-500'
    })),
    ...medicalHistory.medicalExaminations.map(exam => ({
      id: `exam-${exam.id}`,
      date: exam.dateOfRealization,
      type: 'examination' as const,
      title: `Examen: ${exam.examType}`,
      description: exam.laboratoryName,
      icon: <BeakerIcon className="h-5 w-5" />,
      color: 'bg-orange-500'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Línea de Tiempo Médica</h3>
      
      <div className="flow-root">
        <ul className="-mb-8">
          {timelineEvents.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== timelineEvents.length - 1 ? (
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
      </div>
    </div>
  );
};