import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Alert, Card } from '@/components/ui';
import { useAdministrativeById } from '@/hooks/usePersonal';
import { ROUTES } from '@/constants';

const AdministrativeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  if (!id || id === 'undefined' || isNaN(parseInt(id, 10))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ID de administrativo inválido</h2>
          <p className="text-gray-600 mb-4">El identificador proporcionado no es válido.</p>
          <Button onClick={() => navigate('/staff/personal')} variant="primary">
            Volver al Personal
          </Button>
        </div>
      </div>
    );
  }

  const administrativeId = parseInt(id, 10);
  const { administrative, loading, error } = useAdministrativeById(administrativeId);

  const formatStatus = (status: string) => {
    return status === 'A' ? 'Activo' : 'Inactivo';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert type="error" message={error} />
          <div className="mt-4 text-center">
            <Button onClick={() => navigate('/staff/personal')} variant="primary">
              Volver al Personal
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
          <span className="text-gray-600">Cargando información del personal administrativo...</span>
        </div>
      </div>
    );
  }

  if (!administrative) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal administrativo no encontrado</h2>
          <Button onClick={() => navigate('/staff/personal')} variant="primary">
            Volver al Personal
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
                        onClick={() => navigate('/staff/personal')}
                        className="ml-4 text-gray-400 hover:text-gray-500"
                      >
                        Personal
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                      <span className="ml-4 text-gray-500">{administrative.personalData.name} {administrative.personalData.lastName}</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                Información del Personal Administrativo
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Detalles completos del registro del personal administrativo
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => navigate(`/staff/administrative/${administrative.id}/edit`)}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar</span>
              </Button>
              <Button
                onClick={() => navigate('/staff/personal')}
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
            {/* Personal Information */}
            <Card title="Información Personal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Número de Identificación</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.personalData.idNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.personalData.name} {administrative.personalData.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.personalData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.personalData.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Fecha de Contratación</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(administrative.personalData.dateOfHiring)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Estado</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    administrative.personalData.status === 'A' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formatStatus(administrative.personalData.status)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Administrative Information */}
            <Card title="Información del Cargo">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cargo</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Departamento</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.department}</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Información del Departamento</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{administrative.department}</h4>
                      <p className="text-sm text-gray-500">Cargo: {administrative.position}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Administrativo
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* User Information */}
            <Card title="Información de Acceso al Sistema">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nombre de Usuario</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.personalData.userData.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Roles</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {administrative.personalData.userData.roles.map((role, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="text-center">
                <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {administrative.personalData.name[0]}{administrative.personalData.lastName[0]}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {administrative.personalData.name} {administrative.personalData.lastName}
                </h3>
                <p className="text-sm text-gray-500">ID: {administrative.personalData.idNumber}</p>
                <p className="text-sm text-gray-600 font-medium">{administrative.position}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{administrative.department}</div>
                    <div className="text-xs text-gray-500">Departamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {formatStatus(administrative.personalData.status)}
                    </div>
                    <div className="text-xs text-gray-500">Estado</div>
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
                  📋 Ver Tareas Asignadas
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => alert('Función próximamente disponible')}
                >
                  📊 Ver Reportes
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => alert('Función próximamente disponible')}
                >
                  🏢 Ver Departamento
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => navigate(`/staff/administrative/${administrative.id}/edit`)}
                >
                  ✏️ Editar Información
                </Button>
              </div>
            </Card>

            {/* Department Information */}
            <Card title="Departamento">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Departamento</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{administrative.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Cargo Actual</label>
                  <p className="mt-1 text-sm text-gray-900">{administrative.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Disponibilidades</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {administrative.personalData.availabilityIds?.length || 0} horarios configurados
                  </p>
                </div>
              </div>
            </Card>

            {/* Contac Information */}
            <Card title="Información de Contacto">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{administrative.personalData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-500">{administrative.personalData.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Departamento</p>
                    <p className="text-sm text-gray-500">{administrative.department}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrativeDetailPage;