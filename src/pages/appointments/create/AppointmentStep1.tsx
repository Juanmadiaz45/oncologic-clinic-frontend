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
  const { nextStep } = useAppointmentSteps(1, isFormValid);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AppointmentHeader
        title="Agendar Cita Médica"
        step="Seleccionar paciente"
        currentStep={1}
        totalSteps={2}
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
            <PatientSearchInput
              searchTerm={searchTerm}
              searchResults={searchResults}
              isSearching={isSearchingPatients}
              selectedPatient={formData.patient}
              onSearchChange={handleSearchChange}
              onPatientSelect={handlePatientSelect}
            />

            <AppointmentTypeSelector
              appointmentTypes={appointmentTypes}
              selectedTypeId={formData.appointmentTypeId}
              isLoading={isLoadingTypes}
              onChange={selectAppointmentType}
            />

            {formData.duration > 0 && (
              <DurationDisplay
                duration={formData.duration}
                isCalculating={isCalculatingDuration}
              />
            )}

            <TasksList
              tasks={formData.medicalTasks}
              selectedTypeId={formData.appointmentTypeId}
              totalDuration={formData.duration}
            />

            <div className="flex justify-end pt-4">
              <Button
                onClick={nextStep}
                disabled={!isFormValid}
                size="lg"
                className="min-w-[120px]"
              >
                Siguiente →
              </Button>
            </div>
          </div>
        </CardContainer>
      </main>
    </div>
  );
};

export default AppointmentStep1;
