import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { useMedicalAppointment } from '@/hooks/useMedicalAppointment';
import { useAuth } from '@/hooks/useAuth';
import MedicalTasks from '@/components/medical-appointment/MedicalTasks';
import Observations from '@/components/medical-appointment/Observations';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Treatments from '@/components/medical-appointment/Treatments';

const MedicalAppointment: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tasks' | 'observations' | 'treatments'>('tasks');
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const { currentUser } = useAuth();
  
  const {
    appointment,
    tasks,
    observations,
    treatments,
    treatmentTypes,
    isLoading,
    error,
    startAppointment,
    completeAppointment,
    toggleTaskCompletion,
    createObservation,
    createTreatment,
    allTasksCompleted,
    completedTasksCount,
    totalTasksCount
  } = useMedicalAppointment(parseInt(appointmentId || '0'));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mx-auto h-12 w-12 border-4 border-clinic-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Cargando cita médica...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Alert
            type="error"
            title="Error al cargar"
            message={error || 'No se pudo cargar la cita médica'}
          />
          <Button
            onClick={() => navigate('/dashboard')}
            variant="primary"
            className="mt-4"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleStartAppointment = async () => {
    try {
      await startAppointment();
    } catch (error) {
      console.error('Error starting appointment:', error);
    }
  };

  const handleCompleteAppointment = async () => {
    try {
      await completeAppointment();
      setShowCompleteConfirm(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDIENTE: { bg: 'bg-clinic-100', text: 'text-clinic-800', label: 'Pendiente' },
      EN_PROGRESO: { bg: 'bg-green-100', text: 'text-green-800', label: 'En Progreso' },
      COMPLETADA: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
      CANCELADA: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
      PROGRAMADA: { bg: 'bg-clinic-100', text: 'text-clinic-800', label: 'Programada' },
      SCHEDULED: { bg: 'bg-clinic-100', text: 'text-clinic-800', label: 'Programada' },
      IN_PROGRESS: { bg: 'bg-green-100', text: 'text-green-800', label: 'En Progreso' },
      COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status || 'Sin estado'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const tabs = [
    { 
      key: 'tasks' as const, 
      label: 'Tareas Médicas', 
      count: `${completedTasksCount}/${totalTasksCount}` 
    },
    { 
      key: 'observations' as const, 
      label: 'Observaciones', 
      count: observations.length.toString() 
    },
    { 
      key: 'treatments' as const, 
      label: 'Tratamientos', 
      count: treatments.length.toString() 
    }
  ];

  const showCompleteButton = appointment.status === 'EN_PROGRESO' && allTasksCompleted && totalTasksCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Volver</span>
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cita Médica</h1>
                <p className="text-sm text-gray-600">
                  Dr. {currentUser?.username} • {new Date(appointment.appointmentDate).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {getStatusBadge(appointment.status)}
              
              {appointment.status === 'PROGRAMADA' && (
                <Button
                  onClick={handleStartAppointment}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <PlayIcon className="h-4 w-4" />
                  <span>Iniciar Cita</span>
                </Button>
              )}

              {showCompleteButton && (
                <Button
                  onClick={() => setShowCompleteConfirm(true)}
                  variant="primary"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Terminar Cita Médica</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert para completar tareas */}
      {appointment.status === 'EN_PROGRESO' && !allTasksCompleted && totalTasksCount > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Alert
              type="warning"
              message={`Complete todas las tareas médicas (${completedTasksCount}/${totalTasksCount}) para terminar la cita.`}
            />
          </div>
        </div>
      )}

      {/* Patient Info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-clinic-500" />
              <div>
                <p className="text-sm text-gray-500">Paciente</p>
                <p className="font-semibold text-gray-900">{appointment.patientName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-5 w-5 text-clinic-500" />
              <div>
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-semibold text-gray-900">
                  {new Date(appointment.appointmentDate).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-5 w-5 text-clinic-500" />
              <div>
                <p className="text-sm text-gray-500">Consultorio</p>
                <p className="font-semibold text-gray-900">{appointment.officeName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'border-clinic-500 text-clinic-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.key 
                      ? 'bg-clinic-100 text-clinic-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tasks' && (
          <MedicalTasks
            tasks={tasks}
            onTaskToggle={toggleTaskCompletion}
            completedCount={completedTasksCount}
            totalCount={totalTasksCount}
          />
        )}

        {activeTab === 'observations' && (
          <Observations
            observations={observations}
            appointmentId={appointment.id}
            onCreateObservation={createObservation}
          />
        )}
        {activeTab === 'treatments' && (
          <Treatments
            treatments={treatments}
            treatmentTypes={treatmentTypes}
            appointmentId={appointment.id}
            patientId={appointment.patientId}
            onCreateTreatment={createTreatment}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Terminar Cita Médica
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Está seguro de que desea terminar esta cita médica? Esta acción marcará la cita como completada.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={handleCompleteAppointment}
                variant="primary"
                className="flex-1"
              >
                Sí, Terminar Cita
              </Button>
              <Button
                onClick={() => setShowCompleteConfirm(false)}
                variant="secondary"
                className="flex-1"
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

export default MedicalAppointment;