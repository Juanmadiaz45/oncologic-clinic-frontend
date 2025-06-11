import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Alert, Card } from '@/components/ui';
import { usePatient } from '@/hooks/usePatient';
import { ROUTES } from '@/constants';

const PatientDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = id ? parseInt(id, 10) : undefined;
  
  const { patient, loading, error } = usePatient(patientId);

  const formatGender = (gender: string) => {
    const genderMap = {
      'M': 'Masculino',
      'F': 'Femenino',
      'O': 'Otro'
    };
    return genderMap[gender as keyof typeof genderMap] || gender;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert type="error" message={error} />
          <div className="mt-4 text-center">
            <Button onClick={() => navigate(ROUTES.PATIENTS)} variant="primary">
              Volver a Pacientes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando información del paciente...</span>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Paciente no encontrado</h2>
          <Button onClick={() => navigate(ROUTES.PATIENTS)} variant="primary">
            Volver a Pacientes
          </Button>
        </div>
      </div>
    );
  }

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
                      <span className="ml-4 text-gray-500">{patient.name}</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                Información del Paciente
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Detalles completos del registro del paciente
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => navigate(`/patients/${patient.id}/edit`)}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar</span>
              </Button>
              <Button
                onClick={() => navigate(ROUTES.PATIENTS)}
                variant="secondary"
              >
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Principal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Data */}
            <Card title="Información Personal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(patient.birthDate)} ({calculateAge(patient.birthDate)} años)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Género</label>
                  <p className="mt-1 text-sm text-gray-900">{formatGender(patient.gender)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Dirección</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.address}</p>
                </div>
              </div>
            </Card>

            {/* User Information */}
            <Card title="Información de Acceso al Sistema">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-500">Nombre de Usuario</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.userData.username}</p>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-500">Roles</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {patient.userData.roles.map((role: { name: string }, index: number) => (
                        <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                            {role.name}
                        </span>
                        ))}
                    </div>
                    </div>
                </div>
            </Card>

            {/* Medical History */}
            {patient.medicalHistory && (
              <Card title="Historial Médico">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Creación</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(patient.medicalHistory.creationDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Estado de Salud Actual</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {patient.medicalHistory.currentHealthStatus}
                    </p>
                  </div>
                  
                  {/* History Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {patient.medicalHistory.medicalAppointmentIds?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Citas Médicas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {patient.medicalHistory.medicalExaminationIds?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Exámenes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {patient.medicalHistory.appointmentResultIds?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Resultados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {patient.medicalHistory.examinationResultIds?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Análisis</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar and summary */}
            <Card>
              <div className="text-center">
                <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">ID: {patient.id}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{calculateAge(patient.birthDate)}</div>
                    <div className="text-xs text-gray-500">Años</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{formatGender(patient.gender)}</div>
                    <div className="text-xs text-gray-500">Género</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Acciones Rápidas">
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => alert('Función próximamente disponible')}
                >
                  📅 Nueva Cita
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => navigate(`/patients/${patient.id}/examinations/create`)}
                >
                  🧪 Nuevo Examen Médico
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => navigate(`/patients/${patient.id}/medical-history`)}
                >
                  📋 Ver Historial
                </Button>
              </div>
            </Card>

            {/* System Information */}
            <Card title="Información del Sistema">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID del Paciente:</span>
                  <span className="font-medium">{patient.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Usuario:</span>
                  <span className="font-medium">{patient.userData.username}</span>
                </div>
                {patient.medicalHistory && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID Historial:</span>
                      <span className="font-medium">{patient.medicalHistory.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Creado:</span>
                      <span className="font-medium">
                        {new Date(patient.medicalHistory.creationDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;