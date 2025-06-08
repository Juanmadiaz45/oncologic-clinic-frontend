import React, { useState, useEffect } from 'react';
import { AppointmentHeader } from '@/components/appointments/AppointmentHeader';
import { CardContainer } from '@/components/ui/CardContainer';
import { useAppointmentSteps } from '@/hooks/useAppointmentSteps';
import { useAppointments } from '@/hooks/useAppointments';
import {
  PatientSearchInput,
  AppointmentTypeSelector,
  DurationDisplay,
  TasksList,
} from '@/components/appointments';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { Patient } from '@/types';

const AppointmentStep1: React.FC = () => {
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
  const isFormValid = !!(formData.patient && formData.appointmentTypeId);

  const { nextStep, prevStep, canGoNext } = useAppointmentSteps(1, isFormValid);

  useEffect(() => {
    loadAppointmentTypes();
  }, [loadAppointmentTypes]);

  useEffect(() => {
    if (formData.appointmentTypeId) {
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

  const handleNext = () => {
    if (canGoNext) {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppointmentHeader
        title="Agendar Cita Médica"
        step="Seleccionar paciente y tipo de cita"
        currentStep={1}
        totalSteps={2}
        onBack={handleBack}
        showBackButton={true}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CardContainer>
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
            {/* Patient search */}
            <PatientSearchInput
              searchTerm={searchTerm}
              searchResults={searchResults}
              isSearching={isSearchingPatients}
              selectedPatient={formData.patient}
              onSearchChange={handleSearchChange}
              onPatientSelect={handlePatientSelect}
            />

            {/* Appointment type selector */}
            <AppointmentTypeSelector
              appointmentTypes={appointmentTypes}
              selectedTypeId={formData.appointmentTypeId}
              isLoading={isLoadingTypes}
              onChange={selectAppointmentType}
            />

            {/* Show duration if available */}
            {formData.duration > 0 && (
              <DurationDisplay
                duration={formData.duration}
                isCalculating={isCalculatingDuration}
              />
            )}

            {/* Medical To-Do List */}
            <TasksList
              tasks={formData.medicalTasks}
              selectedTypeId={formData.appointmentTypeId}
              totalDuration={formData.duration}
            />

            {/* Navigation buttons */}
            <div className="flex justify-end pt-6">
              <div className="flex items-center space-x-4">
                {!isFormValid && (
                  <p className="text-sm text-gray-500">
                    Seleccione un paciente y tipo de cita para continuar
                  </p>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  variant="primary"
                  size="lg"
                  className="min-w-[120px]"
                >
                  Siguiente →
                </Button>
              </div>
            </div>
          </div>
        </CardContainer>
      </main>
    </div>
  );
};

export default AppointmentStep1;
