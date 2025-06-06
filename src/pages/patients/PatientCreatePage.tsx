import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientForm } from '@/components/forms/PatientForm';
import { Alert } from '@/components/ui';
import { usePatientForm } from '@/hooks/usePatientForm';
import patientService from '@/services/api/patientService';
import { CreatePatientRequest } from '@/types/patients/extended';
import { ROUTES, MESSAGES } from '@/constants';

const PatientCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (data: CreatePatientRequest) => {
    try {
      await patientService.createPatient(data);
      setAlert({ type: 'success', message: MESSAGES.SUCCESS.CREATE });
      
      setTimeout(() => {
        navigate(ROUTES.PATIENTS);
      }, 2000);
    } catch (error) {
      console.error('Error creating patient:', error);
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : MESSAGES.ERROR.CREATE 
      });
    }
  };

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit: onSubmit
  } = usePatientForm({
    mode: 'create',
    onSubmit: handleSubmit
  });

  const handleCancel = () => {
    navigate(ROUTES.PATIENTS);
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
                      <span className="ml-4 text-gray-500">Registro de Paciente</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">Registro de Paciente</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete la información requerida para registrar un nuevo paciente en el sistema
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
              isEditMode={false}
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

export default PatientCreatePage;