import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentHeader } from '@/components/appointments/AppointmentHeader';
import { CardContainer } from '@/components/ui/CardContainer';
import { DoctorSearch } from '@/components/appointments/DoctorSearch';
import { DateTimeSelector } from '@/components/appointments/DateTimeSelector';
import { OfficeSelector } from '@/components/appointments/OfficeSelector';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { useAppointmentSteps } from '@/hooks/useAppointmentSteps';
import { useAppointmentStep2 } from '@/hooks/useAppointmentStep2';
import { ROUTES } from '@/constants';

const AppointmentStep2: React.FC = () => {
  const navigate = useNavigate();
  const { prevStep } = useAppointmentSteps(2, true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    // Form data
    formData,
    step2Data,
    specialities,

    // Loading states
    isSearchingDoctors,
    isLoadingDoctors,
    isLoadingTimeSlots,
    isLoadingOffices,
    isCreatingAppointment,
    error,

    // Actions
    searchDoctors,
    getDoctorsBySpeciality,
    selectDoctor,
    setSelectedDate,
    selectTimeSlot,
    setSelectedOffice,
    createAppointment,
    setError,

    // Computed
    isFormValid,
    canCreateAppointment,
  } = useAppointmentStep2();

  // Check if we have required data from step 1
  useEffect(() => {
    if (!formData.patient || !formData.appointmentTypeId) {
      navigate(ROUTES.APPOINTMENT_CREATE_STEP1);
    }
  }, [formData.patient, formData.appointmentTypeId, navigate]);

  const handleBack = () => {
    prevStep();
  };

  const handleDoctorSearchTermChange = (term: string) => {
    searchDoctors(term);
  };

  const handleSpecialityChange = (specialityId: number | null) => {
    if (specialityId) {
      getDoctorsBySpeciality(specialityId);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleCreateAppointment = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCreate = async () => {
    try {
      await createAppointment();
      setShowConfirmModal(false);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setShowConfirmModal(false);
    }
  };

  const handleCancelCreate = () => {
    setShowConfirmModal(false);
  };

  if (!formData.patient || !formData.appointmentTypeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Información incompleta
          </h2>
          <p className="text-gray-600 mb-4">
            Debe completar el paso 1 antes de continuar
          </p>
          <Button
            onClick={() => navigate(ROUTES.APPOINTMENT_CREATE_STEP1)}
            variant="primary"
          >
            Ir al Paso 1
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppointmentHeader
        title="Agendar Cita Médica"
        step="Programar fecha y hora"
        currentStep={2}
        totalSteps={2}
        onBack={handleBack}
        showBackButton={true}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}
        {/* Patient Summary */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Resumen de la Cita
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Paciente:</span>{' '}
              <span className="text-gray-700">{formData.patient.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Duración:</span>{' '}
              <span className="text-gray-700">{formData.duration} minutos</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Doctor Selection */}
          <CardContainer>
            <DoctorSearch
              searchTerm={step2Data.doctorSearchTerm}
              selectedSpecialityId={step2Data.selectedSpecialityId}
              availableDoctors={step2Data.availableDoctors}
              specialities={specialities}
              selectedDoctor={step2Data.selectedDoctor}
              isSearching={isSearchingDoctors}
              isLoading={isLoadingDoctors}
              onSearchTermChange={handleDoctorSearchTermChange}
              onSpecialityChange={handleSpecialityChange}
              onDoctorSelect={selectDoctor}
            />
          </CardContainer>

          {/* Right Column - Date, Time & Office */}
          <div className="space-y-6">
            {/* Date and Time Selection */}
            {step2Data.selectedDoctor && (
              <CardContainer>
                <DateTimeSelector
                  selectedDate={step2Data.selectedDate}
                  selectedTimeSlot={step2Data.selectedTimeSlot}
                  availableTimeSlots={step2Data.availableTimeSlots}
                  isLoadingTimeSlots={isLoadingTimeSlots}
                  onDateChange={handleDateChange}
                  onTimeSlotSelect={selectTimeSlot}
                />
              </CardContainer>
            )}

            {/* Office Selection */}
            {step2Data.selectedTimeSlot && (
              <CardContainer>
                <OfficeSelector
                  selectedOfficeId={step2Data.selectedOfficeId}
                  availableOffices={step2Data.availableOffices}
                  isLoadingOffices={isLoadingOffices}
                  onOfficeSelect={setSelectedOffice}
                />
              </CardContainer>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-8 flex justify-end items-center">
          <div className="flex items-center space-x-4">
            {!isFormValid && (
              <p className="text-sm text-gray-500">
                Complete todos los campos requeridos
              </p>
            )}
            <Button
              onClick={handleCreateAppointment}
              disabled={!canCreateAppointment}
              variant="primary"
              size="lg"
              isLoading={isCreatingAppointment}
              className="min-w-[150px]"
            >
              Agendar Cita Médica
            </Button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Cita Médica
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p>
                <strong>Paciente:</strong> {formData.patient?.name}
              </p>
              <p>
                <strong>Doctor:</strong> Dr.{' '}
                {step2Data.selectedDoctor?.personalData.name}{' '}
                {step2Data.selectedDoctor?.personalData.lastName}
              </p>
              <p>
                <strong>Fecha:</strong> {step2Data.selectedDate}
              </p>
              <p>
                <strong>Hora:</strong> {step2Data.selectedTimeSlot?.startTime} -{' '}
                {step2Data.selectedTimeSlot?.endTime}
              </p>
              <p>
                <strong>Consultorio:</strong>{' '}
                {
                  step2Data.availableOffices.find(
                    o => o.id === step2Data.selectedOfficeId
                  )?.name
                }
              </p>
              <p>
                <strong>Duración:</strong> {formData.duration} minutos
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleConfirmCreate}
                variant="primary"
                className="flex-1"
                isLoading={isCreatingAppointment}
              >
                Confirmar
              </Button>
              <Button
                onClick={handleCancelCreate}
                variant="secondary"
                className="flex-1"
                disabled={isCreatingAppointment}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentStep2;
