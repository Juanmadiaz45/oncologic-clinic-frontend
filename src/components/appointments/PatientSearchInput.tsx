// src/components/appointments/PatientSearchInput.tsx
import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Patient } from '@/types';
import { PatientBasicInfo } from './PatientBasicInfo';

interface PatientSearchInputProps {
  searchTerm: string;
  searchResults: Patient[];
  isSearching: boolean;
  selectedPatient: Patient | null;
  onSearchChange: (value: string) => void;
  onPatientSelect: (patient: Patient) => void;
}

export const PatientSearchInput: React.FC<PatientSearchInputProps> = ({
  searchTerm,
  searchResults,
  isSearching,
  selectedPatient,
  onSearchChange,
  onPatientSelect,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buscar paciente por número de cédula
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Ingrese número de cédula del paciente"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
        />
        <MagnifyingGlassIcon className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {searchResults.map(patient => (
              <button
                key={patient.id}
                onClick={() => onPatientSelect(patient)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors duration-200"
              >
                <div className="font-medium text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-500">
                  Cédula: {patient.idNumber}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-clinic-500"></div>
          <span>Buscando pacientes...</span>
        </div>
      )}

      {/* Selected Patient Display */}
      {selectedPatient && (
        <div className="mt-6">
          <PatientBasicInfo patient={selectedPatient} />
        </div>
      )}
    </div>
  );
};
