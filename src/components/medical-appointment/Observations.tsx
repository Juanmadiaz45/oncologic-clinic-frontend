import React, { useState } from 'react';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Observation, CreateObservationRequest } from '@/types/appointments/medicalAppointmentTypesPage';
import Button from '@/components/ui/Button';

interface ObservationsProps {
  observations: Observation[];
  appointmentId: number;
  onCreateObservation: (data: CreateObservationRequest) => void;
}

const Observations: React.FC<ObservationsProps> = ({
  observations,
  appointmentId,
  onCreateObservation
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newObservation, setNewObservation] = useState({
    content: '',
    recommendation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newObservation.content.trim()) return;

    onCreateObservation({
      content: newObservation.content,
      recommendation: newObservation.recommendation || undefined,
      medicalAppointmentId: appointmentId
    });

    setNewObservation({ content: '', recommendation: '' });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setNewObservation({ content: '', recommendation: '' });
    setIsCreating(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return new Date().toLocaleString('es-ES');
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return new Date().toLocaleString('es-ES');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Observaciones Médicas</h3>
          <Button
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nueva Observación</span>
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isCreating && (
          <div className="p-6 border-b border-gray-100 bg-blue-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observación *
                </label>
                <textarea
                  value={newObservation.content}
                  onChange={(e) => setNewObservation(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
                  rows={3}
                  placeholder="Escriba su observación médica aquí..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recomendación (opcional)
                </label>
                <textarea
                  value={newObservation.recommendation}
                  onChange={(e) => setNewObservation(prev => ({ ...prev, recommendation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
                  rows={2}
                  placeholder="Recomendaciones adicionales..."
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newObservation.content.trim()}
                >
                  Guardar Observación
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {observations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-400">No hay observaciones</p>
              <p className="text-sm text-gray-400 mt-1">Las observaciones aparecerán aquí cuando sean creadas</p>
            </div>
          ) : (
            observations.map(observation => (
              <div key={observation.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-500">
                    {formatDate(observation.createdAt)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Observación:</h4>
                    <p className="text-gray-900 leading-relaxed">{observation.content}</p>
                  </div>
                  
                  {observation.recommendation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Recomendación:</h4>
                      <p className="text-gray-700 leading-relaxed bg-green-50 p-3 rounded-lg border border-green-200">
                        {observation.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Observations;