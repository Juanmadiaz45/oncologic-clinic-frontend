import React from 'react';
import { AppointmentType } from '@/types';

interface AppointmentTypeSelectorProps {
  appointmentTypes: AppointmentType[];
  selectedTypeId: number | null;
  isLoading: boolean;
  onChange: (typeId: number) => void;
}

export const AppointmentTypeSelector: React.FC<
  AppointmentTypeSelectorProps
> = ({ appointmentTypes, selectedTypeId, isLoading, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = parseInt(e.target.value);
    if (!isNaN(typeId)) {
      onChange(typeId);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar tipo de cita médica *
      </label>
      <select
        value={selectedTypeId || ''}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <option value="">
          {isLoading
            ? 'Cargando tipos de cita...'
            : 'Seleccione un tipo de cita'}
        </option>
        {appointmentTypes.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      {isLoading && (
        <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-clinic-500"></div>
          <span>Cargando tipos de cita...</span>
        </div>
      )}
    </div>
  );
};
