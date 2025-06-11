import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  BeakerIcon, 
  DocumentChartBarIcon,
  CalendarIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { Alert, Button } from '@/components/ui';
import { useExaminations } from '@/hooks/useExaminations';
import { useMedicalHistory } from '@/hooks/useMedicalHistory';
import { useAppDispatch } from '@/store';
import { asyncActions } from '@/store/slices/medicalHistory';
import { MedicalExamination } from '@/types/examinations';
import examinationService from '@/services/api/examinationService';

export const ExaminationResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patientId } = useParams<{ patientId: string }>();
  const [selectedExamination, setSelectedExamination] = useState<MedicalExamination | null>(null);
  const [isGeneratingResult, setIsGeneratingResult] = useState(false);
  const [generatingExamId, setGeneratingExamId] = useState<string | null>(null);
  
  const {
    loading,
    error,
    examinations,
    examinationResults,
    loadPatientExaminations,
    loadExaminationResults,
    clearError
  } = useExaminations();

  const { medicalHistory } = useMedicalHistory();

  useEffect(() => {
    if (patientId) {
      dispatch(asyncActions.fetchMedicalHistory(parseInt(patientId)));
      loadPatientExaminations(parseInt(patientId));
    }
  }, [patientId, dispatch, loadPatientExaminations]);

  useEffect(() => {
    if (medicalHistory?.id) {
      loadExaminationResults(medicalHistory.id);
    }
  }, [medicalHistory?.id, loadExaminationResults]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar si un examen ya tiene resultado
  const hasResult = (): boolean => {
    return examinationResults.some(result => 
      result.medicalHistoryId === medicalHistory?.id && 
      // Asumiendo que hay una relación entre examination y result
      // Podrías necesitar ajustar esta lógica según tu modelo de datos
      result.id // Por ahora verificamos si existe algún resultado
    );
  };


  const handleExaminationClick = async (examination: MedicalExamination) => {
    setSelectedExamination(examination);
    
    // Verificar si ya tiene resultado
    if (hasResult()) {
      console.log('Este examen ya tiene resultado generado');
      return;
    }

    // Solo generar resultado si no existe
    if (!isGeneratingResult && medicalHistory?.id) {
      setIsGeneratingResult(true);
      setGeneratingExamId(examination.id);
      
      try {
        const resultData = {
          generationDate: new Date().toISOString(),
          resultsReport: generateRandomReportFile(),
          medicalHistoryId: medicalHistory.id // Usar el ID correcto
        };
        
        console.log('Generando resultado para examen:', examination.id);
        await examinationService.createExaminationResult(examination.id, resultData);
        
        // Recargar resultados después de crear
        await loadExaminationResults(medicalHistory.id);
        console.log('Resultado generado exitosamente');
        
      } catch (error) {
        console.error('Error al generar resultado:', error);
        // Solo mostrar error si es realmente un error, no si ya existe
        if (error.status !== 409) { // 409 = Conflict (ya existe)
          alert('Error al generar el resultado del examen');
        }
      } finally {
        setIsGeneratingResult(false);
        setGeneratingExamId(null);
      }
    }
  };

  const generateRandomReportFile = (): File => {
    const reportContent = `REPORTE DE EXAMEN MÉDICO
========================

Fecha: ${new Date().toLocaleDateString('es-ES')}
Hora: ${new Date().toLocaleTimeString('es-ES')}

RESULTADOS:
- Parámetro A: ${Math.floor(Math.random() * 100) + 50} mg/dL
- Parámetro B: ${(Math.random() * 10 + 5).toFixed(2)} g/dL
- Parámetro C: ${Math.floor(Math.random() * 200) + 100} U/L

OBSERVACIONES:
${getRandomObservation()}

CONCLUSIÓN:
Resultados dentro de los parámetros normales.
Se recomienda seguimiento médico regular.

---
Reporte generado automáticamente el ${new Date().toLocaleString('es-ES')}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    return new File([blob], `reporte_examen_${Date.now()}.txt`, { 
      type: 'text/plain',
      lastModified: Date.now()
    });
  };

  const getRandomObservation = (): string => {
    const observations = [
      'Valores dentro del rango normal.',
      'Se observan ligeras variaciones que requieren monitoreo.',
      'Resultados satisfactorios según los estándares clínicos.',
      'Se recomienda repetir el examen en 3 meses.',
      'Parámetros estables, continuar con el tratamiento actual.'
    ];
    return observations[Math.floor(Math.random() * observations.length)];
  };

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert type="error" message="ID de paciente no válido" />
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
                  <DocumentChartBarIcon className="h-6 w-6 text-clinic-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Resultados de Exámenes Médicos
                  </h1>
                  <p className="text-sm text-gray-600">
                    Historial completo de exámenes y resultados del paciente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={clearError} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Examinations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <BeakerIcon className="h-5 w-5 text-clinic-500" />
                  <span>Exámenes Médicos</span>
                </h3>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando exámenes...</p>
                  </div>
                ) : examinations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <BeakerIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-400">No hay exámenes registrados</p>
                    <p className="text-sm text-gray-400 mt-1">Los exámenes aparecerán aquí cuando sean creados</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {examinations.map(examination => {
                      const hasExamResult = hasResult();
                      const isGenerating = generatingExamId === examination.id;
                      
                      return (
                        <button
                          key={examination.id}
                          onClick={() => handleExaminationClick(examination)}
                          disabled={isGenerating}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 relative ${
                            selectedExamination?.id === examination.id ? 'bg-clinic-50 border-r-4 border-clinic-500' : ''
                          } ${isGenerating ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900">
                                {examination.typeOfExamName || `Examen ${examination.id}`}
                              </div>
                              {hasExamResult && (
                                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ Con resultado
                                </div>
                              )}
                              {isGenerating && (
                                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Generando...
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {examination.laboratoryName}
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{formatDate(examination.dateOfRealization)}</span>
                            </div>
                          </div>
                          
                          {isGenerating && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-clinic-500"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Examination Details */}
          <div className="lg:col-span-2">
            {selectedExamination ? (
              <div className="space-y-6">
                {/* Examination Info */}
                <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Detalles del Examen
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Tipo de Examen
                      </label>
                      <div className="text-base font-medium text-gray-900">
                        {selectedExamination.typeOfExamName}
                      </div>
                      {selectedExamination.typeOfExamDescription && (
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedExamination.typeOfExamDescription}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Fecha de Realización
                      </label>
                      <div className="flex items-center space-x-1 text-base text-gray-900">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span>{formatDateTime(selectedExamination.dateOfRealization)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Laboratorio
                      </label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-base font-medium text-gray-900">
                          <BuildingOffice2Icon className="h-4 w-4 text-gray-400" />
                          <span>{selectedExamination.laboratoryName}</span>
                        </div>
                        {selectedExamination.laboratoryLocation && (
                          <div className="text-sm text-gray-600 ml-5">
                            {selectedExamination.laboratoryLocation}
                          </div>
                        )}
                        {selectedExamination.laboratoryTelephone && (
                          <div className="text-sm text-gray-600 ml-5">
                            Tel: {selectedExamination.laboratoryTelephone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        ID del Examen
                      </label>
                      <div className="text-base text-gray-900 font-mono">
                        {selectedExamination.id}
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Examination Results */}
                  <div className="space-y-4">
                    {examinationResults
                      .filter(result => result.medicalHistoryId === medicalHistory?.id)
                      .map(result => (
                        <div
                          key={result.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  Resultado generado:
                                </span>
                                <span className="text-sm text-gray-600">
                                  {formatDateTime(result.generationDate)}
                                </span>
                                {result.hasReport && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    ✓ Reporte disponible
                                  </span>
                                )}
                              </div>
              
                              {result.reportContent && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  📋 Contenido del Reporte
                                </span>
                                <div className="flex items-center space-x-2">
                                  {result.reportSizeBytes && (
                                    <span className="text-xs text-gray-500">
                                      {(result.reportSizeBytes / 1024).toFixed(1)} KB
                                    </span>
                                  )}
                            </div>
                          </div>
                  
                          {/* Mostrar contenido del reporte */}
                          <div className="bg-white p-3 rounded border border-gray-200 max-h-64 overflow-y-auto">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                              {result.reportContent}
                            </pre>
                          </div>
                        </div>
                      )}

                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      ✅ Resultado procesado y disponible
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
                </div>
            ) : (
              <div className="bg-white rounded-xl shadow-card border border-gray-200 p-12 text-center">
                <BeakerIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Seleccione un examen
                </h3>
                <p className="text-gray-400">
                  Seleccione un examen médico de la lista para ver sus detalles y resultados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};