import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface DurationDisplayProps {
  duration: number;
  isCalculating: boolean;
}

export const DurationDisplay: React.FC<DurationDisplayProps> = ({
  duration,
  isCalculating,
}) => {
  if (isCalculating) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-clinic-500"></div>
          <span className="text-gray-600">Calculando duración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-700">
            Duración estimada de la cita
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Incluye tiempo de tareas médicas + tiempo de holgura
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-clinic-500" />
          <span className="text-2xl font-semibold text-clinic-600">
            {duration} minutos
          </span>
        </div>
      </div>
    </div>
  );
};
