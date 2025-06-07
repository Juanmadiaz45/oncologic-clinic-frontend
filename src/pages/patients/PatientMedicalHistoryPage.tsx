import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Alert, Card } from '@/components/ui';
import { MedicalHistoryTimeline } from '@/components/medicalHistory/MedicalHistoryTimeline';
import { TreatmentsList } from '@/components/medicalHistory/TreatmentsList';
import { ObservationsList } from '@/components/medicalHistory/ObservationsList';
import { MedicalHistoryStats } from '@/components/medicalHistory/MedicalHistoryStats';
import { useMedicalHistory } from '@/hooks/useMedicalHistory';
import { usePatient } from '@/hooks/usePatient';
import { ROUTES } from '@/constants';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const PatientMedicalHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = id ? parseInt(id, 10) : undefined;
  
  const { patient, loading: patientLoading } = usePatient(patientId);
  const { 
    medicalHistory, 
    loading: historyLoading, 
    error, 
    stats,
    fetchMedicalHistory,
    clearError 
  } = useMedicalHistory(patientId);

  console.log('🎯 PatientId:', patientId);
  console.log('📊 Loading state:', historyLoading);
  console.log('❌ Error:', error);
  console.log('📋 Medical History:', medicalHistory);
  console.log('📈 Stats:', stats);

  const isLoading = patientLoading || historyLoading;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert 
            type="error" 
            message={error}
            onClose={clearError}
          />
          <div className="mt-4 text-center space-x-4">
            <Button onClick={fetchMedicalHistory} variant="primary">
              Reintentar
            </Button>
            <Button onClick={() => navigate(`/patients/${patientId}`)} variant="secondary">
              Volver al Paciente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-clinic-500" />
          <span className="text-gray-600">Cargando historial médico...</span>
        </div>
      </div>
    );
  }

  if (!medicalHistory || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Historial no encontrado</h2>
          <div className="space-x-4">
            <Button onClick={fetchMedicalHistory} variant="primary">
              Recargar
            </Button>
            <Button onClick={() => navigate(ROUTES.PATIENTS)} variant="secondary">
              Volver a Pacientes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <button
                      onClick={() => navigate(ROUTES.DASHBOARD)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Inicio
                    </button>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                      <button
                        onClick={() => navigate(ROUTES.PATIENTS)}
                        className="ml-4 text-gray-400 hover:text-gray-500"
                      >
                        Pacientes
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                      <button
                        onClick={() => navigate(`/patients/${patientId}`)}
                        className="ml-4 text-gray-400 hover:text-gray-500"
                      >
                        {patient.name}
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                      <span className="ml-4 text-gray-500">Historial Médico</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                Historial Médico - {patient.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Registro completo de la historia clínica del paciente
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchMedicalHistory}
                disabled={historyLoading}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  historyLoading 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-clinic-600 hover:bg-gray-100'
                }`}
                title="Actualizar historial"
              >
                <ArrowPathIcon className={`h-5 w-5 ${historyLoading ? 'animate-spin' : ''}`} />
              </button>
              <Button
                onClick={() => navigate(`/patients/${patientId}`)}
                variant="secondary"
              >
                Volver al Paciente
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Patient Summary */}
        <div className="mb-8">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Paciente</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{patient.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Creación del Historial</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(medicalHistory.creationDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Estado de Salud Actual</label>
                <p className="mt-1 text-sm text-gray-900">{medicalHistory.currentHealthStatus}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <MedicalHistoryStats stats={stats} loading={historyLoading} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <TreatmentsList treatments={medicalHistory.treatments} />
            <ObservationsList appointmentResults={medicalHistory.appointmentResults} />
          </div>

          {/* Right Column */}
          <div>
            <MedicalHistoryTimeline medicalHistory={medicalHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistoryPage;