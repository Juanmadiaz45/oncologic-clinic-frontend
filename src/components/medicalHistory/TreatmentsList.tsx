import React from 'react';
import { Card } from '@/components/ui';
import { TreatmentDetail } from '@/types/medicalHistory';

interface TreatmentsListProps {
  treatments: TreatmentDetail[];
}

export const TreatmentsList: React.FC<TreatmentsListProps> = ({ treatments }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Programado</span>;
    } else if (now >= start && now <= end) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Activo</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Completado</span>;
    }
  };

  return (
    <Card title="Tratamientos">
      <div className="space-y-4">
        {treatments.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No hay tratamientos registrados</p>
        ) : (
          treatments.map(treatment => (
            <div key={treatment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{treatment.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
                </div>
                {getStatusBadge(treatment.dateStart, treatment.endDate)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Inicio:</span>
                  <span className="ml-2 text-gray-900">{formatDate(treatment.dateStart)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Fin:</span>
                  <span className="ml-2 text-gray-900">{formatDate(treatment.endDate)}</span>
                </div>
              </div>

              {treatment.prescribedMedicines.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Medicamentos:</h5>
                  <div className="space-y-2">
                    {treatment.prescribedMedicines.map(medicine => (
                      <div key={medicine.id} className="text-sm bg-gray-50 p-2 rounded">
                        <div className="font-medium">{medicine.medicine}</div>
                        <div className="text-gray-600">
                          {medicine.dose} - {medicine.frequencyOfAdministration}
                        </div>
                        <div className="text-gray-500 text-xs">{medicine.instructions}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};