import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import UserDropdown from '@/components/ui/UserDropdown';
import {
  PatientSearchInput,
  AppointmentTypeSelector,
  DurationDisplay,
  TasksList,
} from '@/components/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { ROUTES } from '@/constants';
import { Patient } from '@/types';

const AppointmentStep1: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    searchResults,
    appointmentTypes,
    isSearchingPatients,
    isLoadingTypes,
    isCalculatingDuration,
    error,
    searchPatients,
    loadAppointmentTypes,
    selectPatient,
    selectAppointmentType,
    calculateDuration,
    clearSearchResults,
    setError,
  } = useAppointments();

  const [searchTerm, setSearchTerm] = useState('');

  // Load appointment types on component mount
  useEffect(() => {
    loadAppointmentTypes();
  }, [loadAppointmentTypes]);

  // Calculate duration when type is selected
  useEffect(() => {
    if (formData.appointmentTypeId && formData.appointmentTypeId !== null) {
      calculateDuration(formData.appointmentTypeId);
    }
  }, [formData.appointmentTypeId, calculateDuration]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchPatients(value.trim());
    } else {
      clearSearchResults();
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    selectPatient(patient);
    setSearchTerm(patient.idNumber);
    clearSearchResults();
  };

  const handleTypeChange = (typeId: number) => {
    selectAppointmentType(typeId);
  };

  const handleNext = () => {
    if (!isFormValid) return;
    navigate(ROUTES.APPOINTMENT_CREATE_STEP2);
  };

  const isFormValid = formData.patient && formData.appointmentTypeId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <CalendarDaysIcon className="h-6 w-6 text-clinic-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Agendar Cita Médica
              </h1>
              <span className="text-sm text-gray-500">
                Paso 1 de 2: Seleccionar paciente
              </span>
            </div>
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-card border border-gray-200 p-8">
          {error && (
            <div className="mb-6">
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          <div className="space-y-6">
            {/* Patient Search */}
            <PatientSearchInput
              searchTerm={searchTerm}
              searchResults={searchResults}
              isSearching={isSearchingPatients}
              selectedPatient={formData.patient}
              onSearchChange={handleSearchChange}
              onPatientSelect={handlePatientSelect}
            />

            {/* Appointment Type Selection */}
            <AppointmentTypeSelector
              appointmentTypes={appointmentTypes}
              selectedTypeId={formData.appointmentTypeId}
              isLoading={isLoadingTypes}
              onChange={handleTypeChange}
            />

            {/* Duration Display */}
            {formData.duration > 0 && (
              <DurationDisplay
                duration={formData.duration}
                isCalculating={isCalculatingDuration}
              />
            )}

            {/* Medical Tasks List */}
            <TasksList
              tasks={formData.medicalTasks}
              selectedTypeId={formData.appointmentTypeId}
              totalDuration={formData.duration}
            />

            {/* Navigation */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNext}
                disabled={!isFormValid}
                size="lg"
                className="min-w-[120px]"
              >
                Siguiente →
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentStep1;
