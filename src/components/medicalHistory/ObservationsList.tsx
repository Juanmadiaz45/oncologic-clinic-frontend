import React from 'react';
import { Card } from '@/components/ui';
import { AppointmentResultDetail } from '@/types/medicalHistory';

interface ObservationsListProps {
  appointmentResults: AppointmentResultDetail[];
}

export const ObservationsList: React.FC<ObservationsListProps> = ({ appointmentResults }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card title="Observaciones Médicas">
      <div className="space-y-4">
        {appointmentResults.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No hay observaciones registradas</p>
        ) : (
          appointmentResults.map(result => (
            <div key={result.id} className="border-l-4 border-blue-500 pl-4 py-3">
              <div className="text-sm text-gray-500 mb-2">
                {formatDate(result.evaluationDate)}
              </div>
              {result.observations.map(observation => (
                <div key={observation.id} className="mb-3">
                  <div className="text-gray-900 mb-1">{observation.content}</div>
                  {observation.recommendation && (
                    <div className="text-sm bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                      <span className="font-medium text-blue-800">Recomendación:</span>
                      <span className="text-blue-700 ml-1">{observation.recommendation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};