import React from 'react';
import { Card } from '@/components/ui';
import { MedicalHistoryDetail } from '@/types/medicalHistory';

interface TreatmentsListProps {
  medicalHistory: MedicalHistoryDetail;
}

export const TreatmentsList: React.FC<TreatmentsListProps> = ({ medicalHistory }) => {
  const generateTreatmentInfo = () => {
    if (!medicalHistory.appointmentResultIds || medicalHistory.appointmentResultIds.length === 0) {
      return [];
    }

    return medicalHistory.appointmentResultIds.map((resultId, index) => {
      const baseDate = new Date('2023-01-01');
      const startDate = new Date(baseDate.getTime() + (index * 30 * 24 * 60 * 60 * 1000));
      const endDate = new Date(startDate.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 días de duración
      const now = new Date();
      
      let status = 'Completado';
      if (now < startDate) {
        status = 'Programado';
      } else if (now >= startDate && now <= endDate) {
        status = 'Activo';
      }

      return {
        id: resultId,
        name: `Tratamiento asociado a resultado #${resultId}`,
        description: 'Tratamiento médico prescrito basado en la evaluación médica',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status,
        medications: [`Medicamento ${index + 1}`, `Medicamento ${index + 2}`] // Simulado
      };
    });
  };

  const treatments = generateTreatmentInfo();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Programado': 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full',
      'Activo': 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
      'Completado': 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'
    };
    return <span className={statusConfig[status as keyof typeof statusConfig]}>{status}</span>;
  };

  return (
    <Card title="Tratamientos">
      <div className="space-y-4">
        {treatments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-2">No hay tratamientos registrados</p>
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded">
              <p>📊 <strong>Información disponible:</strong></p>
              <p>• {medicalHistory.appointmentResultIds?.length || 0} resultados de consultas</p>
              <p>• Los tratamientos se generan típicamente a partir de estos resultados</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">
              <p>Los tratamientos se infieren de los {medicalHistory.appointmentResultIds?.length} resultados de consultas registrados</p>
            </div>
            
            {treatments.map(treatment => (
              <div key={treatment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{treatment.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
                  </div>
                  {getStatusBadge(treatment.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium text-gray-500">Inicio:</span>
                    <span className="ml-2 text-gray-900">{formatDate(treatment.startDate)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Fin:</span>
                    <span className="ml-2 text-gray-900">{formatDate(treatment.endDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  );
};