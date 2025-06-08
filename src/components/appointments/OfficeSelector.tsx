import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { MedicalOffice } from '@/types';

interface OfficeSelectorProps {
  selectedOfficeId: number | null;
  availableOffices: MedicalOffice[];
  isLoadingOffices: boolean;
  onOfficeSelect: (officeId: number) => void;
}

export const OfficeSelector: React.FC<OfficeSelectorProps> = ({
  selectedOfficeId,
  availableOffices,
  isLoadingOffices,
  onOfficeSelect,
}) => {
  const selectedOffice = availableOffices.find(
    office => office.id === selectedOfficeId
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seleccionar Consultorio
        </h3>

        {isLoadingOffices ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-clinic-500"></div>
            <span className="ml-2 text-gray-600">Cargando consultorios...</span>
          </div>
        ) : availableOffices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p className="text-sm">No hay consultorios disponibles</p>
            <p className="text-xs text-gray-400 mt-1">
              Para el horario seleccionado
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOffices.map(office => (
              <button
                key={office.id}
                onClick={() => onOfficeSelect(office.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedOfficeId === office.id
                    ? 'border-clinic-500 bg-clinic-50'
                    : 'border-gray-200 bg-white hover:border-clinic-300 hover:bg-clinic-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      selectedOfficeId === office.id
                        ? 'bg-clinic-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <BuildingOfficeIcon
                      className={`h-5 w-5 ${
                        selectedOfficeId === office.id
                          ? 'text-clinic-600'
                          : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        selectedOfficeId === office.id
                          ? 'text-clinic-900'
                          : 'text-gray-900'
                      }`}
                    >
                      {office.name}
                    </div>
                    <div
                      className={`text-sm ${
                        selectedOfficeId === office.id
                          ? 'text-clinic-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {office.location}
                    </div>
                    {office.equipment && (
                      <div
                        className={`text-xs mt-1 ${
                          selectedOfficeId === office.id
                            ? 'text-clinic-500'
                            : 'text-gray-500'
                        }`}
                      >
                        Equipamiento: {office.equipment}
                      </div>
                    )}
                  </div>
                  {selectedOfficeId === office.id && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-clinic-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Office Summary */}
        {selectedOffice && (
          <div className="mt-4 bg-clinic-50 border border-clinic-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-clinic-800 mb-2">
              Consultorio Seleccionado
            </h4>
            <div className="flex items-center space-x-2 text-clinic-700">
              <BuildingOfficeIcon className="h-5 w-5" />
              <span className="font-medium">{selectedOffice.name}</span>
            </div>
            <p className="text-sm text-clinic-600 mt-1">
              {selectedOffice.location}
            </p>
            {selectedOffice.equipment && (
              <p className="text-xs text-clinic-500 mt-1">
                Equipamiento: {selectedOffice.equipment}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
