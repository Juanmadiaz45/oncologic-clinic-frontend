import React, { useState } from 'react';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { DoctorResponseDTO } from '@/types';
import { SpecialityResponseDTO } from '@/types/personal';

interface DoctorSearchProps {
  searchTerm: string;
  selectedSpecialityId: number | null;
  availableDoctors: DoctorResponseDTO[];
  specialities: SpecialityResponseDTO[];
  selectedDoctor: DoctorResponseDTO | null;
  isSearching: boolean;
  isLoading: boolean;
  onSearchTermChange: (term: string) => void;
  onSpecialityChange: (specialityId: number | null) => void;
  onDoctorSelect: (doctor: DoctorResponseDTO) => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({
  searchTerm,
  selectedSpecialityId,
  availableDoctors,
  specialities,
  selectedDoctor,
  isSearching,
  isLoading,
  onSearchTermChange,
  onSpecialityChange,
  onDoctorSelect,
}) => {
  const [searchType, setSearchType] = useState<'name' | 'speciality'>('name');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchTypeChange = (type: 'name' | 'speciality') => {
    setSearchType(type);
    onSearchTermChange('');
    onSpecialityChange(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔍 DoctorSearch - Input onChange:', {
      oldValue: localSearchTerm,
      newValue: newValue,
      oldLength: localSearchTerm.length,
      newLength: newValue.length,
      keyPressed: 'input_change',
    });

    setLocalSearchTerm(newValue);
    onSearchTermChange(newValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seleccionar Doctor
        </h3>

        {/* Search Type Selector */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => handleSearchTypeChange('name')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              searchType === 'name'
                ? 'bg-clinic-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Buscar por Nombre
          </button>
          <button
            onClick={() => handleSearchTypeChange('speciality')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              searchType === 'speciality'
                ? 'bg-clinic-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Filtrar por Especialidad
          </button>
        </div>

        {/* Search Input or Speciality Selector */}
        {searchType === 'name' ? (
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Buscar doctor por nombre..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        ) : (
          <select
            value={selectedSpecialityId || ''}
            onChange={e =>
              onSpecialityChange(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
          >
            <option value="">Seleccione una especialidad</option>
            {specialities.map(speciality => (
              <option key={speciality.id} value={speciality.id}>
                {speciality.name}
              </option>
            ))}
          </select>
        )}

        {/* Loading States */}
        {(isSearching || isLoading) && (
          <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-clinic-500"></div>
            <span>
              {isSearching ? 'Buscando doctores...' : 'Cargando doctores...'}
            </span>
          </div>
        )}
      </div>

      {/* Selected Doctor Display */}
      {selectedDoctor && (
        <div className="bg-clinic-50 border border-clinic-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-clinic-800 mb-2">
            Doctor Seleccionado
          </h4>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-clinic-100 rounded-full">
              <UserIcon className="h-5 w-5 text-clinic-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                Dr. {selectedDoctor.personalData.name}{' '}
                {selectedDoctor.personalData.lastName}
              </div>
              <div className="text-sm text-gray-600">
                Licencia: {selectedDoctor.medicalLicenseNumber}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctors List */}
      {!selectedDoctor && availableDoctors.length > 0 && (
        <div className="border border-gray-200 rounded-lg">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">
              Doctores Disponibles ({availableDoctors.length})
            </h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {availableDoctors.map(doctor => (
              <button
                key={doctor.id}
                onClick={() => onDoctorSelect(doctor)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <UserIcon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Dr. {doctor.personalData.name}{' '}
                      {doctor.personalData.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {doctor.personalData.email} •{' '}
                      {doctor.personalData.phoneNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      Licencia: {doctor.medicalLicenseNumber}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {!selectedDoctor &&
        !isSearching &&
        !isLoading &&
        availableDoctors.length === 0 &&
        (searchTerm || selectedSpecialityId) && (
          <div className="text-center py-6 text-gray-500">
            <UserIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p className="text-sm">No se encontraron doctores</p>
          </div>
        )}
    </div>
  );
};
