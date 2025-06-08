import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon,
  BeakerIcon,
  DocumentChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { MedicalHistoryResponse } from '@/types/medicalHistory';
import medicalHistoryDetailsService, { TimelineEvent } from '@/services/api/medicalHistoryDetailsService';

interface MedicalHistoryTimelineProps {
  medicalHistory: MedicalHistoryResponse;
}

export const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({ 
  medicalHistory 
}) => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'creation':
        return <ClipboardDocumentListIcon className="h-5 w-5" />;
      case 'appointment':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'appointment-result':
        return <ClipboardDocumentListIcon className="h-5 w-5" />;
      case 'examination':
        return <BeakerIcon className="h-5 w-5" />;
      case 'examination-result':
        return <DocumentChartBarIcon className="h-5 w-5" />;
      default:
        return <ClipboardDocumentListIcon className="h-5 w-5" />;
    }
  };

  const loadTimelineWithRealDates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando timeline con fechas reales...');
      
      const events = await medicalHistoryDetailsService.getMedicalHistoryTimeline(
        medicalHistory.medicalAppointmentIds,
        medicalHistory.appointmentResultIds,
        medicalHistory.medicalExaminationIds,
        medicalHistory.examinationResultIds,
        medicalHistory.creationDate
      );

      const eventsWithIcons = events.map(event => ({
        ...event,
        icon: getIcon(event.type)
      }));

      setTimelineEvents(eventsWithIcons);
      console.log('✅ Timeline cargado exitosamente');
      
    } catch (err) {
      console.error('❌ Error cargando timeline:', err);
      setError('Error al cargar las fechas del timeline');
      
      const basicEvents: TimelineEvent[] = [
        {
          id: 'creation',
          type: 'creation',
          title: 'Creación del Historial Médico',
          description: 'Se registró el historial médico del paciente',
          date: medicalHistory.creationDate,
          icon: getIcon('creation'),
          color: 'bg-clinic-500'
        },
        ...medicalHistory.medicalAppointmentIds.map(id => ({
          id: `appointment-${id}`,
          type: 'appointment' as const,
          title: `Cita Médica #${id}`,
          description: 'Consulta médica (fecha no disponible)',
          date: medicalHistory.creationDate,
          icon: getIcon('appointment'),
          color: 'bg-blue-500'
        })),
        ...medicalHistory.appointmentResultIds.map(id => ({
          id: `result-${id}`,
          type: 'appointment-result' as const,
          title: `Resultado de Consulta #${id}`,
          description: 'Evaluación médica (fecha no disponible)',
          date: medicalHistory.creationDate,
          icon: getIcon('appointment-result'),
          color: 'bg-green-500'
        })),
        ...medicalHistory.medicalExaminationIds.map(id => ({
          id: `exam-${id}`,
          type: 'examination' as const,
          title: `Examen Médico ${id}`,
          description: 'Estudio médico (fecha no disponible)',
          date: medicalHistory.creationDate,
          icon: getIcon('examination'),
          color: 'bg-orange-500'
        })),
        ...medicalHistory.examinationResultIds.map(id => ({
          id: `exam-result-${id}`,
          type: 'examination-result' as const,
          title: `Resultado de Examen #${id}`,
          description: 'Informe de examen (fecha no disponible)',
          date: medicalHistory.creationDate,
          icon: getIcon('examination-result'),
          color: 'bg-purple-500'
        }))
      ];
      
      setTimelineEvents(basicEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadData = async () => {
    await loadTimelineWithRealDates();
  };
  
  loadData();
}, [medicalHistory.id]);

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Línea de Tiempo Médica</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {timelineEvents.length} evento{timelineEvents.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={loadTimelineWithRealDates}
            disabled={loading}
            className={`p-1 rounded transition-colors duration-200 ${
              loading 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-400 hover:text-clinic-600 hover:bg-gray-100'
            }`}
            title="Actualizar timeline"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error}. Mostrando información básica disponible.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-clinic-500 mb-4" />
          <p className="text-gray-600">Cargando fechas reales del timeline...</p>
        </div>
      ) : timelineEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-lg font-medium text-gray-400">Sin eventos registrados</p>
          <p className="text-sm text-gray-400 mt-1">Los eventos médicos aparecerán aquí cuando se registren</p>
        </div>
      ) : (
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
                      <span className={`${event.color} h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white shadow-sm`}>
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
                        {event.details && (
                          <div className="mt-1">
                            <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              ✓ Fecha confirmada
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={event.date} className="block">
                          {formatDate(event.date)}
                        </time>
                        {event.details && event.type !== 'creation' && (
                          <span className="text-xs text-gray-400 block">
                            {formatTime(event.date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};