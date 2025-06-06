import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonalForm } from '@/components/forms/PersonalForm';
import { Alert } from '@/components/ui';
import { usePersonalForm } from '@/hooks/usePersonalForm';
import { administrativeService } from '@/services/api/personalService';
import { AdministrativeDTO, PersonalType } from '@/types/personal';
import { ROUTES, MESSAGES } from '@/constants';

const AdministrativeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (data: AdministrativeDTO) => {
    try {
      await administrativeService.createAdministrative(data);
      setAlert({ type: 'success', message: MESSAGES.SUCCESS.CREATE });
      
      // Redirect after successful creation
      setTimeout(() => {
        navigate('/staff/personal');
      }, 2000);
    } catch (error) {
      console.error('Error creating administrative:', error);
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
  } = usePersonalForm({
    mode: 'create',
    type: PersonalType.ADMINISTRATIVE,
    onSubmit: handleSubmit
  });

  const handleCancel = () => {
    navigate('/staff/personal');
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
                      <span className="ml-4 text-gray-500">Registro de Administrativo</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">Registro de Personal Administrativo</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete la información requerida para registrar nuevo personal administrativo en el sistema
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
            <PersonalForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isEditMode={false}
              personalType={PersonalType.ADMINISTRATIVE}
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

export default AdministrativeCreatePage;