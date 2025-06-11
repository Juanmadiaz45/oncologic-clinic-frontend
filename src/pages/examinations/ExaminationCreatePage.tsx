import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, BeakerIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ExaminationForm } from '@/components/forms/ExaminationForm';
import { Alert, Button } from '@/components/ui';
import { useExaminations } from '@/hooks/useExaminations';
import { CreateMedicalExaminationRequest } from '@/types/examinations';
import { MedicalExamination } from '@/types/examinations';

export const ExaminationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdExamination, setCreatedExamination] = useState<MedicalExamination | null>(null);

  
  const {
    loading,
    error,
    laboratories,
    typeOfExams,
    loadLaboratories,
    loadTypeOfExams,
    createExamination,
    clearError
  } = useExaminations();


  useEffect(() => {
    loadLaboratories();
    loadTypeOfExams();
  }, [loadLaboratories, loadTypeOfExams]);

  const handleSubmit = async (data: CreateMedicalExaminationRequest) => {
    if (!patientId) return;

    try {
      const result = await createExamination(parseInt(patientId), data);
      console.log('Examination created successfully:', result);
      
      setCreatedExamination(result);
      setShowSuccess(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error creating examination:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleViewResults = () => {
    navigate(`/patients/${patientId}/examinations/results`);
  };

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert
          type="error"
          message="ID de paciente no válido"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Volver</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-clinic-50 rounded-lg">
                  <BeakerIcon className="h-6 w-6 text-clinic-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Nuevo Examen Médico
                  </h1>
                  <p className="text-sm text-gray-600">
                    Crear examen médico para el paciente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && createdExamination && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-900">
                ¡Examen Médico Creado Exitosamente!
              </h3>
              <p className="text-green-700 text-lg">
                El examen médico ha sido programado correctamente
              </p>
              <div className="bg-white rounded-lg p-4 border border-green-200 max-w-md mx-auto">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">ID del Examen:</span>
                    <span className="text-gray-900 font-mono">{createdExamination.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Fecha:</span>
                    <span className="text-gray-900">
                      {new Date(createdExamination.dateOfRealization).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4 pt-4">
                <Button
                  onClick={handleViewResults}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <span>Ver Resultados de Exámenes</span>
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <span>Crear Otro Examen</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error}
              onClose={clearError}
            />
          </div>
        )}

        {!showSuccess && (
          <div className="bg-white rounded-xl shadow-card border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Información del Examen Médico
              </h2>
              <p className="text-gray-600">
                Complete la información requerida para programar el examen médico.
              </p>
            </div>

            <ExaminationForm
              laboratories={laboratories}
              typeOfExams={typeOfExams}
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};