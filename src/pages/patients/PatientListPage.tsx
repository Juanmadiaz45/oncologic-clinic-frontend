import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Card } from '@/components/ui';
import { PatientTable } from '@/components/tables/PatientTable';
import { usePatients } from '@/hooks/usePatients';
import patientService from '@/services/api/patientService';
import { PatientResponse } from '@/types/patients/extended';
import { ROUTES, MESSAGES } from '@/constants';

const PatientListPage: React.FC = () => {
  const navigate = useNavigate();
  const { patients, loading, error, refetch } = usePatients();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreatePatient = () => {
    navigate(ROUTES.PATIENT_CREATE);
  };

  const handleEditPatient = (patient: PatientResponse) => {
    navigate(`/patients/${patient.id}/edit`);
  };

  const handleViewPatient = (patient: PatientResponse) => {
    navigate(`/patients/${patient.id}`);
  };

  const handleDeletePatient = async (patient: PatientResponse) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar al paciente ${patient.name}?`)) {
      return;
    }

    setDeletingId(patient.id);
    try {
      await patientService.deletePatient(patient.id);
      setAlert({ type: 'success', message: MESSAGES.SUCCESS.DELETE });
      refetch();
    } catch (error) {
      console.error('Error deleting patient:', error);
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : MESSAGES.ERROR.DELETE 
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
                      <span className="ml-4 text-gray-500">Pacientes</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
              <p className="mt-1 text-sm text-gray-500">
                Administre la información de los pacientes registrados en el sistema
              </p>
            </div>
            <Button
              onClick={handleCreatePatient}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nuevo Paciente</span>
            </Button>
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

        <Card>
          <PatientTable
            patients={patients}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleEditPatient}
            onView={handleViewPatient}
            onDelete={handleDeletePatient}
          />
        </Card>
      </div>
    </div>
  );
};

export default PatientListPage;