import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Card } from '@/components/ui';
import { PersonalTable } from '@/components/tables/PersonalTable';
import { usePersonal } from '@/hooks/usePersonal';
import { doctorService, administrativeService } from '@/services/api/personalService';
import { DoctorResponseDTO, AdministrativeResponseDTO } from '@/types/personal';
import { ROUTES } from '@/constants';

type PersonalWithType = (DoctorResponseDTO | AdministrativeResponseDTO) & { type: 'DOCTOR' | 'ADMINISTRATIVE' };

const PersonalListPage: React.FC = () => {
  const navigate = useNavigate();
  const { personal, loading, error, refetch } = usePersonal();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreateDoctor = () => {
    navigate(ROUTES.DOCTOR_CREATE);
  };

  const handleCreateAdministrative = () => {
    navigate(ROUTES.ADMINISTRATIVE_CREATE);
  };

  const handleEditPerson = (person: PersonalWithType) => {
    if (person.type === 'DOCTOR') {
      navigate(`/staff/doctors/${person.id}/edit`);
    } else {
      navigate(`/staff/administrative/${person.id}/edit`);
    }
  };

  const handleViewPerson = (person: PersonalWithType) => {
    if (person.type === 'DOCTOR') {
      navigate(`/staff/doctors/${person.id}`);
    } else {
      navigate(`/staff/administrative/${person.id}`);
    }
  };

  const handleDeletePerson = async (person: PersonalWithType) => {
      if (!person.id) {
        setAlert({
          type: 'error',
          message: 'Error: No se puede eliminar - ID del personal no válido'
        });
        return;
      }

      const personName = `${person.personalData.name} ${person.personalData.lastName}`;
      const personType = person.type === 'DOCTOR' ? 'doctor' : 'administrativo';
      
      if (!window.confirm(`¿Está seguro de que desea eliminar al ${personType} ${personName}?`)) {
        return;
      }

      setDeletingId(person.id);
      try {
        if (person.type === 'DOCTOR') {
          await doctorService.deleteDoctor(person.id);
        } else {
          await administrativeService.deleteAdministrative(person.id);
        }
        
        setAlert({
          type: 'success',
          message: `${personType.charAt(0).toUpperCase() + personType.slice(1)} eliminado exitosamente`
        });
        refetch();
        
      } catch (error: unknown) {
        console.error('Error deleting person:', error);
        
        const errorMessage = 'No se puede eliminar este profesional porque tiene citas médicas asociadas.';
        
        setAlert({
          type: 'error',
          message: errorMessage
        });
      } finally {
        setDeletingId(null);
      }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert type="error" message={error} />
          <div className="mt-4 text-center">
            <Button onClick={refetch} variant="primary">
              Reintentar
            </Button>
          </div>
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
                      <span className="ml-4 text-gray-500">Personal</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">Gestión de Personal</h1>
              <p className="mt-1 text-sm text-gray-500">
                Administre la información del personal médico y administrativo
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleCreateAdministrative}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nuevo Administrativo</span>
              </Button>
              <Button
                onClick={handleCreateDoctor}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nuevo Doctor</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <Card className="overflow-x-auto">
          <PersonalTable
            personal={personal as PersonalWithType[]}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleEditPerson}
            onView={handleViewPerson}
            onDelete={handleDeletePerson}
          />
        </Card>
      </div>
    </div>
  );
};

export default PersonalListPage;