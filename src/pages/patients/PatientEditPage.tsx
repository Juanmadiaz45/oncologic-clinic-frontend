// src/pages/patients/PatientEditPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PatientForm } from '@/components/forms/PatientForm';
import { Alert } from '@/components/ui';
import { usePatientForm } from '@/hooks/usePatientForm';
import { usePatient } from '@/hooks/usePatient';
import patientService from '@/services/api/patientService';
import { UpdatePatientRequest, PatientEditFormData } from '@/types/patients/extended';
import { ROUTES, MESSAGES } from '@/constants';

const PatientEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = id ? parseInt(id, 10) : undefined;
  
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { patient, loading: patientLoading, error: patientError } = usePatient(patientId);

  const handleSubmit = async (data: UpdatePatientRequest) => {
    if (!patientId) return;
    
    try {
      await patientService.updatePatient(patientId, data);
      setAlert({ type: 'success', message: MESSAGES.SUCCESS.UPDATE });
      
      // Redirect after successful update
      setTimeout(() => {
        navigate(ROUTES.PATIENTS);
      }, 2000);
    } catch (error) {
      console.error('Error updating patient:', error);
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : MESSAGES.ERROR.UPDATE 
      });
    }
  };

  const getInitialFormData = (): PatientEditFormData | undefined => {
    if (!patient) return undefined;
    
    return {
      id: patient.id,
      idNumber: patient.idNumber,
      name: patient.name,
      birthDate: patient.birthDate,
      gender: patient.gender,
      address: patient.address,
      phoneNumber: patient.phoneNumber,
      email: patient.email
    };
  };

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit: onSubmit
  } = usePatientForm({
    mode: 'edit',
    onSubmit: handleSubmit,
    initialData: getInitialFormData()
  });

  const handleCancel = () => {
    navigate(ROUTES.PATIENTS);
  };

  if (patientError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert
            type="error"
            message={patientError}
          />
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(ROUTES.PATIENTS)}
              className="btn btn-primary"
            >
              Volver a Pacientes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (patientLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando información del paciente...</span>
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
                      <span className="ml-4 text-gray-500">Editar Paciente</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                Editar Paciente: {patient?.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Modifique la información del paciente según sea necesario
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <PatientForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isEditMode={true}
              onFieldChange={updateField}
              onSubmit={onSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientEditPage;