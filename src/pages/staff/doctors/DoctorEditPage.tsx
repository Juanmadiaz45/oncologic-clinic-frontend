import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PersonalForm } from '@/components/forms/PersonalForm';
import { Alert } from '@/components/ui';
import { usePersonalForm } from '@/hooks/usePersonalForm';
import { useDoctor, useSpecialities } from '@/hooks/usePersonal';
import { doctorService } from '@/services/api/personalService';
import { DoctorDTO, PersonalType, DoctorEditFormData } from '@/types/personal';
import { ROUTES, MESSAGES } from '@/constants';

const DoctorEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const doctorId = id ? parseInt(id, 10) : undefined;
  
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { doctor, loading: doctorLoading, error: doctorError } = useDoctor(doctorId);
  const { specialities } = useSpecialities();

  const handleSubmit = async (data: Partial<DoctorDTO>) => {
    if (!doctorId) return;
    
    try {
      await doctorService.updateDoctor(doctorId, data);
      setAlert({ type: 'success', message: MESSAGES.SUCCESS.UPDATE });
      
      // Redirect after successful update
      setTimeout(() => {
        navigate('/staff/personal');
      }, 2000);
    } catch (error) {
      console.error('Error updating doctor:', error);
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : MESSAGES.ERROR.UPDATE 
      });
    }
  };

  const getInitialFormData = (): DoctorEditFormData | undefined => {
    if (!doctor) return undefined;
    
    const dateOnly = doctor.personalData.dateOfHiring.split('T')[0];
    
    return {
      id: doctor.id,
      idNumber: doctor.personalData.idNumber,
      name: doctor.personalData.name,
      lastName: doctor.personalData.lastName,
      email: doctor.personalData.email,
      phoneNumber: doctor.personalData.phoneNumber,
      dateOfHiring: dateOnly,
      status: doctor.personalData.status,
      availabilityIds: doctor.personalData.availabilityIds,
      medicalLicenseNumber: doctor.medicalLicenseNumber,
      specialityIds: doctor.specialityIds
    };
  };

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit: onSubmit
  } = usePersonalForm({
    mode: 'edit',
    type: PersonalType.DOCTOR,
    onSubmit: handleSubmit,
    initialData: getInitialFormData()
  });

  const handleCancel = () => {
    navigate('/staff/personal');
  };

  if (doctorError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert
            type="error"
            message={doctorError}
          />
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/staff/personal')}
              className="btn btn-primary"
            >
              Volver al Personal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (doctorLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando información del doctor...</span>
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
                      <span className="ml-4 text-gray-500">Editar Doctor</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                Editar Doctor: {doctor ? `Dr. ${doctor.personalData.name} ${doctor.personalData.lastName}` : 'Cargando...'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Modifique la información del doctor según sea necesario
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
              isEditMode={true}
              personalType={PersonalType.DOCTOR}
              specialities={specialities}
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

export default DoctorEditPage;