import React, { useState } from 'react';
import { PlusIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { 
  Treatment, 
  TypeOfTreatment, 
  CreateTreatmentRequest 
} from '@/types/medical-appointment';
import Button from '@/components/ui/Button';
import TreatmentCard from './TreatmentCard';

interface TreatmentsProps {
  treatments: Treatment[];
  treatmentTypes: TypeOfTreatment[];
  appointmentId: number;
  patientId: number;
  onCreateTreatment: (data: CreateTreatmentRequest) => void;
}

const Treatments: React.FC<TreatmentsProps> = ({
  treatments,
  treatmentTypes,
  appointmentId,
  patientId,
  onCreateTreatment
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    description: '',
    dateStart: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTreatment.description.trim()) return;

    try {
      setIsLoading(true);
      onCreateTreatment({
        name: newTreatment.name || undefined,
        description: newTreatment.description,
        dateStart: newTreatment.dateStart,
        endDate: newTreatment.endDate || undefined,
        medicalAppointmentId: appointmentId,
        patientId: patientId
      });

      setNewTreatment({
        name: '',
        description: '',
        dateStart: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating treatment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewTreatment({
      name: '',
      description: '',
      dateStart: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setIsCreating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tratamientos y Medicinas</h3>
          <Button
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
            disabled={isLoading}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nuevo Tratamiento</span>
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isCreating && (
          <div className="p-6 border-b border-gray-100 bg-blue-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Tratamiento (opcional)
                </label>
                <input
                  type="text"
                  value={newTreatment.name}
                  onChange={(e) => setNewTreatment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
                  placeholder="Nombre del tratamiento"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={newTreatment.description}
                  onChange={(e) => setNewTreatment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
                  rows={3}
                  placeholder="Describa el tratamiento..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={newTreatment.dateStart}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, dateStart: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin (opcional)
                  </label>
                  <input
                    type="date"
                    value={newTreatment.endDate}
                    onChange={(e) => setNewTreatment(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
                    min={newTreatment.dateStart}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newTreatment.description.trim() || isLoading}
                  isLoading={isLoading}
                >
                  Crear Tratamiento
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {treatments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BeakerIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-400">No hay tratamientos</p>
              <p className="text-sm text-gray-400 mt-1">Los tratamientos aparecerán aquí cuando sean creados</p>
            </div>
          ) : (
            treatments.map(treatment => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Treatments;