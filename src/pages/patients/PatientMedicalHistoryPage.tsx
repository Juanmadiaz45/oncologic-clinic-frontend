import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Alert, Card } from '@/components/ui';
import { MedicalHistoryTimeline } from '@/components/medicalHistory/MedicalHistoryTimeline';
import { MedicalHistoryStats } from '@/components/medicalHistory/MedicalHistoryStats';
import { useMedicalHistory } from '@/hooks/useMedicalHistory';
import { usePatient } from '@/hooks/usePatient';
import { ROUTES } from '@/constants';
import { ArrowPathIcon, PencilIcon } from '@heroicons/react/24/outline';

const PatientMedicalHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = id ? parseInt(id, 10) : undefined;
  
  const [isEditingHealthStatus, setIsEditingHealthStatus] = useState(false);
  const [newHealthStatus, setNewHealthStatus] = useState('');
  
  const { patient, loading: patientLoading } = usePatient(patientId);
  const { 
    medicalHistory, 
    loading: historyLoading, 
    error, 
    stats,
    fetchMedicalHistory,
    updateHealthStatus,
    clearError 
  } = useMedicalHistory(patientId);

  console.log('🎯 PatientId:', patientId);
  console.log('📊 Loading state:', historyLoading);
  console.log('❌ Error:', error);
  console.log('📋 Medical History:', medicalHistory);
  console.log('📈 Stats:', stats);

  const isLoading = patientLoading || historyLoading;

  const handleEditHealthStatus = () => {
    if (medicalHistory) {
      setNewHealthStatus(medicalHistory.currentHealthStatus);
      setIsEditingHealthStatus(true);
    }
  };

  const handleSaveHealthStatus = async () => {
    if (medicalHistory && newHealthStatus.trim() && newHealthStatus !== medicalHistory.currentHealthStatus) {
      try {
        await updateHealthStatus(medicalHistory.id, newHealthStatus);
        setIsEditingHealthStatus(false);
      } catch (error) {
        console.error('Error updating health status:', error);
      }
    } else {
      setIsEditingHealthStatus(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingHealthStatus(false);
    setNewHealthStatus('');
  };

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
                <div className="mt-1 flex items-center space-x-2">
                  {isEditingHealthStatus ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <textarea
                        value={newHealthStatus}
                        onChange={(e) => setNewHealthStatus(e.target.value)}
                        className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-clinic-500"
                        rows={2}
                      />
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={handleSaveHealthStatus}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-sm text-gray-900">{medicalHistory.currentHealthStatus}</p>
                      <button
                        onClick={handleEditHealthStatus}
                        className="p-1 text-gray-400 hover:text-clinic-600 transition-colors duration-200"
                        title="Editar estado de salud"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <MedicalHistoryStats stats={stats} loading={historyLoading} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Summary Cards */}
          <div className="space-y-6">
            {/* Citas Médicas */}
            <Card title="Citas Médicas Registradas">
              <div className="space-y-3">
                {medicalHistory.medicalAppointmentIds.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No hay citas médicas registradas</p>
                ) : (
                  medicalHistory.medicalAppointmentIds.map((appointmentId) => (
                    <div key={appointmentId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Cita Médica #{appointmentId}</h4>
                          <p className="text-sm text-gray-500">Consulta médica registrada</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Registrada
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Resultados de Citas */}
            <Card title="Resultados de Consultas">
              <div className="space-y-3">
                {medicalHistory.appointmentResultIds.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No hay resultados de consultas registrados</p>
                ) : (
                  medicalHistory.appointmentResultIds.map((resultId) => (
                    <div key={resultId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Resultado de Consulta #{resultId}</h4>
                          <p className="text-sm text-gray-500">Evaluación médica completada</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completado
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Exámenes Médicos */}
            <Card title="Exámenes Médicos">
              <div className="space-y-3">
                {medicalHistory.medicalExaminationIds.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No hay exámenes médicos registrados</p>
                ) : (
                  medicalHistory.medicalExaminationIds.map((examId) => (
                    <div key={examId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Examen {examId}</h4>
                          <p className="text-sm text-gray-500">Estudio médico realizado</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Realizado
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Resultados de Exámenes */}
            <Card title="Resultados de Exámenes">
              <div className="space-y-3">
                {medicalHistory.examinationResultIds.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No hay resultados de exámenes disponibles</p>
                ) : (
                  medicalHistory.examinationResultIds.map((resultId) => (
                    <div key={resultId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Resultado de Examen #{resultId}</h4>
                          <p className="text-sm text-gray-500">Informe de laboratorio disponible</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Disponible
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-8">
          <MedicalHistoryTimeline medicalHistory={medicalHistory} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card title="Acciones Rápidas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => alert('Función próximamente disponible')}
              >
                  📅 Nueva Cita
              </Button>
              <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => alert('Función próximamente disponible')}
              >
                  🔬 Nuevo Examen
              </Button>
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistoryPage;