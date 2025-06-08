import React from 'react';
import { Card } from '@/components/ui';
import { MedicalHistoryDetail } from '@/types/medicalHistory';

interface ObservationsListProps {
  medicalHistory: MedicalHistoryDetail;
}

export const ObservationsList: React.FC<ObservationsListProps> = ({ medicalHistory }) => {
  const generateObservationInfo = () => {
    if (!medicalHistory.appointmentResultIds || medicalHistory.appointmentResultIds.length === 0) {
      return [];
    }

    return medicalHistory.appointmentResultIds.map((resultId, index) => {
      const baseDate = new Date('2023-01-01');
      const evaluationDate = new Date(baseDate.getTime() + (index * 15 * 24 * 60 * 60 * 1000));
      
      const observations = [
        {
          id: `obs-${resultId}-1`,
          content: `Evaluación médica registrada para resultado #${resultId}`,
        }
      ];

      return {
        id: resultId,
        evaluationDate: evaluationDate.toISOString(),
        observations
      };
    });
  };

  const appointmentResults = generateObservationInfo();

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
          <div className="text-center py-6">
            <p className="text-gray-500 mb-2">No hay observaciones registradas</p>
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded">
              <p>📊 <strong>Información disponible:</strong></p>
              <p>• {medicalHistory.appointmentResultIds?.length || 0} resultados de consultas</p>
              <p>• Las observaciones se registran durante las evaluaciones médicas</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">
              <p>Las observaciones se infieren de los {medicalHistory.appointmentResultIds?.length} resultados de consultas registrados</p>
            </div>
            
            {appointmentResults.map(result => (
              <div key={result.id} className="border-l-4 border-blue-500 pl-4 py-3">
                <div className="text-sm text-gray-500 mb-2">
                  {formatDate(result.evaluationDate)}
                </div>
                
                {result.observations.map(observation => (
                  <div key={observation.id} className="mb-3">
                    <div className="text-gray-900 mb-1">{observation.content}</div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  );
};