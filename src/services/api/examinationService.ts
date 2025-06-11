import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import {
  TypeOfExam,
  Laboratory,
  MedicalExamination,
  ExaminationResult,
  CreateMedicalExaminationRequest,
  CreateExaminationResultRequest,
  MedicalExaminationWithResults
} from '@/types/examinations';

class ExaminationService {
  // Laboratories
  async getAllLaboratories(): Promise<Laboratory[]> {
    return api.get<Laboratory[]>(API_ENDPOINTS.LABORATORIES);
  }

  // Types of exams
  async getAllTypeOfExams(): Promise<TypeOfExam[]> {
    return api.get<TypeOfExam[]>(API_ENDPOINTS.EXAM_TYPES);
  }

  // Medical examinations for doctor/admin management
  async createExaminationForPatient(
    patientId: number, 
    data: CreateMedicalExaminationRequest
  ): Promise<MedicalExamination> {
    const requestData = {
      id: `EX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateOfRealization: data.dateOfRealization,
      laboratoryId: data.laboratoryId,
      typeOfExamId: data.typeOfExamId,
      medicalHistoryId: 0 // Se establecerá en el backend
    };
    
    return api.post<MedicalExamination>(
      `/medical-examination-management/patients/${patientId}/examinations`,
      requestData
    );
  }

  async getPatientExaminations(patientId: number): Promise<MedicalExamination[]> {
    return api.get<MedicalExamination[]>(
      `/medical-examination-management/patients/${patientId}/examinations`
    );
  }

  async getExaminationDetails(examinationId: string): Promise<MedicalExaminationWithResults> {
    return api.get<MedicalExaminationWithResults>(
      `/medical-examination-management/examinations/${examinationId}/details`
    );
  }

  async updateExamination(
    examinationId: string,
    data: Partial<CreateMedicalExaminationRequest>
  ): Promise<MedicalExamination> {
    return api.put<MedicalExamination>(
      `/medical-examination-management/examinations/${examinationId}`,
      data
    );
  }

  async deleteExamination(examinationId: string): Promise<void> {
    return api.delete(`/medical-examination-management/examinations/${examinationId}`);
  }

  // Examination results - ACTUALIZADO
  async createExaminationResult(
    examinationId: string,
    data: CreateExaminationResultRequest
  ): Promise<ExaminationResult> {
    console.log('🔄 Creando resultado para examen:', examinationId);
    
    let resultsReportBase64: string | null = null;
    
    if (data.resultsReport) {
      try {
        resultsReportBase64 = await this.fileToBase64Clean(data.resultsReport);
        console.log('✅ Archivo convertido a base64, tamaño:', resultsReportBase64.length);
      } catch (error) {
        console.error('❌ Error convirtiendo archivo a base64:', error);
        throw new Error('Error al procesar el archivo del reporte');
      }
    }
    
    const requestData = {
      generationDate: data.generationDate,
      resultsReportBase64: resultsReportBase64,
      medicalHistoryId: data.medicalHistoryId
    };
    
    console.log('📤 Enviando datos:', {
      ...requestData,
      resultsReportBase64: requestData.resultsReportBase64 ? `[${requestData.resultsReportBase64.length} chars]` : null
    });
    
    try {
      const result = await api.post<ExaminationResult>(
        `${API_ENDPOINTS.EXAMINATION_RESULTS}`,
        requestData
      );
      console.log('✅ Resultado creado exitosamente:', result.id);
      return result;
    } catch (error: unknown) {
      console.error('❌ Error creando resultado:', error);

      if (typeof error === 'object' && error !== null && 'status' in error) {
        const err = error as { status: number; message?: string };

        if (err.status === 409) {
          throw new Error('Ya existe un resultado para este examen');
        } else if (err.status === 400) {
          throw new Error('Datos inválidos en el reporte');
        } else {
          throw new Error(err.message || 'Error al crear el resultado del examen');
        }
      } else {
        throw new Error('Error desconocido al crear el resultado del examen');
      }
    } 
  }

  // Función para convertir archivo a base64 limpio
  private async fileToBase64Clean(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          
          if (!base64Data) {
            throw new Error('No se pudo extraer los datos base64');
          }
          
          if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
            throw new Error('Datos base64 inválidos');
          }
          
          resolve(base64Data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Verificar si un examen ya tiene resultado
  async hasExaminationResult(medicalHistoryId: number): Promise<boolean> {
    try {
      const results = await this.getExaminationResults(medicalHistoryId);
      return results.length > 0;
    } catch (error) {
      console.error('Error verificando existencia de resultados:', error);
      return false;
    }
  }

  // Obtener resultados de exámenes - ACTUALIZADO
  async getExaminationResults(medicalHistoryId: number): Promise<ExaminationResult[]> {
    console.log('🔍 Obteniendo resultados para historial médico:', medicalHistoryId);
    
    try {
      const results = await api.get<ExaminationResult[]>(
        `${API_ENDPOINTS.EXAMINATION_RESULTS}/by-medical-history/${medicalHistoryId}`
      );
      console.log('✅ Resultados obtenidos:', results.length);
      
      // Los resultados ahora incluyen reportContent automáticamente del mapper
      return results;
    } catch (error) {
      console.error('❌ Error obteniendo resultados:', error);
      throw error;
    }
  }

  // Descargar reporte como base64 - ACTUALIZADO
  async downloadReportAsBase64(resultId: number): Promise<string | null> {
    try {
      console.log('🔽 Descargando reporte base64 para resultado:', resultId);
      
      const response = await api.get<{ reportBase64: string; filename?: string }>(
        `${API_ENDPOINTS.EXAMINATION_RESULTS}/${resultId}/report`
      );
      
      console.log('✅ Reporte base64 descargado exitosamente');
      return response.reportBase64;
    } catch (error) {
      console.error('❌ Error descargando reporte:', error);
      return null;
    }
  }

  // Crear archivo para descarga desde base64 - MEJORADO
  createDownloadFromBase64(base64Data: string, filename: string = 'reporte.txt'): void {
    try {
      console.log('📁 Creando descarga desde base64, archivo:', filename);
      
      // Decodificar base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Crear blob y descarga
      const blob = new Blob([bytes], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ Descarga iniciada exitosamente');
    } catch (error) {
      console.error('❌ Error creando descarga:', error);
      throw new Error('Error al descargar el archivo');
    }
  }

  // Obtener contenido del reporte como texto - NUEVO
  async getReportContent(resultId: number): Promise<string | null> {
    try {
      const base64Data = await this.downloadReportAsBase64(resultId);
      if (!base64Data) return null;
      
      // Decodificar base64 a texto
      const binaryString = atob(base64Data);
      return binaryString;
    } catch (error) {
      console.error('Error obteniendo contenido del reporte:', error);
      return null;
    }
  }

  // Verificar si existe resultado para historial médico específico - NUEVO
  async checkResultExists(medicalHistoryId: number): Promise<{ hasResult: boolean }> {
    try {
      const response = await api.get<{ hasResult: boolean; medicalHistoryId: number }>(
        `${API_ENDPOINTS.EXAMINATION_RESULTS}/exists/medical-history/${medicalHistoryId}`
      );
      return { hasResult: response.hasResult };
    } catch (error) {
      console.error('Error verificando existencia de resultado:', error);
      return { hasResult: false };
    }
  }

  // Descargar reporte directamente por ID - NUEVO MÉTODO DE CONVENIENCIA
  async downloadReport(resultId: number, customFilename?: string): Promise<void> {
    try {
      const base64Data = await this.downloadReportAsBase64(resultId);
      
      if (!base64Data) {
        throw new Error('No se pudo obtener el reporte');
      }
      
      const filename = customFilename || `reporte_examen_${resultId}_${new Date().toISOString().split('T')[0]}.txt`;
      this.createDownloadFromBase64(base64Data, filename);
      
    } catch (error) {
      console.error('Error en descarga de reporte:', error);
      throw error;
    }
  }
}

const examinationService = new ExaminationService();
export default examinationService;