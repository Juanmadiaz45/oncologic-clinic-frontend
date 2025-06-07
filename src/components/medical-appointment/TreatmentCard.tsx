import React, { useState, useEffect, useCallback } from 'react';
import {
  PlusIcon,
  BeakerIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  Treatment,
  PrescribedMedicine,
  CreatePrescribedMedicineRequest,
} from '@/types/appointments/medicalAppointmentTypesPage';
import medicalAppointmentService from '@/services/medical-appointment/medicalAppointmentService';
import Button from '@/components/ui/Button';

interface TreatmentCardProps {
  treatment: Treatment;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([]);
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    medicine: '',
    instructions: '',
    dose: '',
    duration: '',
    frequencyOfAdministration: '',
  });

  const loadMedicines = useCallback(async () => {
    try {
      setIsLoading(true);
      const medicinesData =
        await medicalAppointmentService.getTreatmentMedicines(treatment.id);
      setMedicines(medicinesData);
    } catch (error) {
      console.error('Error loading medicines:', error);
    } finally {
      setIsLoading(false);
    }
  }, [treatment.id]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const handleSubmitMedicine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMedicine.medicine.trim() || !newMedicine.dose.trim()) return;

    try {
      setIsLoading(true);
      const medicineData: CreatePrescribedMedicineRequest = {
        medicine: newMedicine.medicine,
        instructions: newMedicine.instructions,
        dose: newMedicine.dose,
        duration: newMedicine.duration,
        frequencyOfAdministration: newMedicine.frequencyOfAdministration,
        treatmentId: treatment.id,
      };

      await medicalAppointmentService.createPrescribedMedicine(medicineData);
      await loadMedicines();

      setNewMedicine({
        medicine: '',
        instructions: '',
        dose: '',
        duration: '',
        frequencyOfAdministration: '',
      });
      setIsAddingMedicine(false);
    } catch (error) {
      console.error('Error creating medicine:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelMedicine = () => {
    setNewMedicine({
      medicine: '',
      instructions: '',
      dose: '',
      duration: '',
      frequencyOfAdministration: '',
    });
    setIsAddingMedicine(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {treatment.name || 'Tratamiento'}
            </h4>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(treatment.dateStart)}</span>
            {treatment.endDate && (
              <>
                <span>-</span>
                <span>{formatDate(treatment.endDate)}</span>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4">
          {treatment.description}
        </p>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-md font-medium text-gray-900 flex items-center space-x-2">
            <BeakerIcon className="h-4 w-4 text-clinic-500" />
            <span>Medicinas Prescritas</span>
            <span className="text-sm text-gray-500">({medicines.length})</span>
          </h5>
          <Button
            onClick={() => setIsAddingMedicine(true)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
            disabled={isLoading}
          >
            <PlusIcon className="h-3 w-3" />
            <span>Agregar Medicina</span>
          </Button>
        </div>

        {isAddingMedicine && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <form onSubmit={handleSubmitMedicine} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicina *
                  </label>
                  <input
                    type="text"
                    value={newMedicine.medicine}
                    onChange={e =>
                      setNewMedicine(prev => ({
                        ...prev,
                        medicine: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 text-sm"
                    placeholder="Nombre del medicamento"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosis *
                  </label>
                  <input
                    type="text"
                    value={newMedicine.dose}
                    onChange={e =>
                      setNewMedicine(prev => ({
                        ...prev,
                        dose: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 text-sm"
                    placeholder="ej: 500mg"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia
                  </label>
                  <input
                    type="text"
                    value={newMedicine.frequencyOfAdministration}
                    onChange={e =>
                      setNewMedicine(prev => ({
                        ...prev,
                        frequencyOfAdministration: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 text-sm"
                    placeholder="ej: Cada 8 horas"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración
                  </label>
                  <input
                    type="text"
                    value={newMedicine.duration}
                    onChange={e =>
                      setNewMedicine(prev => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 text-sm"
                    placeholder="ej: 7 días"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrucciones
                </label>
                <textarea
                  value={newMedicine.instructions}
                  onChange={e =>
                    setNewMedicine(prev => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 text-sm"
                  rows={2}
                  placeholder="Instrucciones adicionales..."
                  disabled={isLoading}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={
                    !newMedicine.medicine.trim() ||
                    !newMedicine.dose.trim() ||
                    isLoading
                  }
                  isLoading={isLoading}
                >
                  Agregar Medicina
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelMedicine}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {isLoading && medicines.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <div className="animate-spin mx-auto h-6 w-6 border-2 border-clinic-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm">Cargando medicinas...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-clinic-500">
              <div className="bg-clinic-100 p-4 rounded-full shadow-sm mb-3">
                <BeakerIcon className="h-8 w-8 text-clinic-500" />
              </div>
              <p className="text-sm text-gray-500">
                No hay medicinas prescritas
              </p>
            </div>
          ) : (
            medicines.map(medicine => (
              <div
                key={medicine.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h6 className="font-medium text-gray-900 mb-1">
                      {medicine.medicine}
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Dosis:</span>{' '}
                        {medicine.dose}
                      </div>
                      {medicine.frequencyOfAdministration && (
                        <div>
                          <span className="font-medium">Frecuencia:</span>{' '}
                          {medicine.frequencyOfAdministration}
                        </div>
                      )}
                      {medicine.duration && (
                        <div>
                          <span className="font-medium">Duración:</span>{' '}
                          {medicine.duration}
                        </div>
                      )}
                    </div>
                    {medicine.instructions && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Instrucciones:</span>{' '}
                        {medicine.instructions}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {formatDate(medicine.prescriptionDate)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;
