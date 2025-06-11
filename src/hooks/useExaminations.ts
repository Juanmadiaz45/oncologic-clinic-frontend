import { useState, useCallback } from 'react';
import examinationService from '@/services/api/examinationService';
import {
  TypeOfExam,
  Laboratory,
  MedicalExamination,
  ExaminationResult,
  CreateMedicalExaminationRequest,
  MedicalExaminationWithResults
} from '@/types/examinations';

export const useExaminations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [typeOfExams, setTypeOfExams] = useState<TypeOfExam[]>([]);
  const [examinations, setExaminations] = useState<MedicalExamination[]>([]);
  const [examinationResults, setExaminationResults] = useState<ExaminationResult[]>([]);

  // Load laboratories
  const loadLaboratories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await examinationService.getAllLaboratories();
      setLaboratories(data);
    } catch (err) {
      console.error('Error loading laboratories:', err);
      setError('Error al cargar laboratorios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load types of exams
  const loadTypeOfExams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await examinationService.getAllTypeOfExams();
      setTypeOfExams(data);
    } catch (err) {
      console.error('Error loading types of exams:', err);
      setError('Error al cargar tipos de examen');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create examination
  const createExamination = useCallback(async (
    patientId: number,
    data: CreateMedicalExaminationRequest
  ): Promise<MedicalExamination> => {
    try {
      setLoading(true);
      setError(null);
      
      // Convertir fecha a formato correcto con hora
      const dateTime = `${data.dateOfRealization}T00:00:00`;
      
      const result = await examinationService.createExaminationForPatient(patientId, {
        ...data,
        dateOfRealization: dateTime
      });
      
      return result;
    } catch (err) {
      console.error('Error creating examination:', err);

      if (err instanceof Error) {
        setError(err.message || 'Error al crear el examen médico');
      } else {
        setError('Error al crear el examen médico');
      }
      throw err;
    }   
 finally {
      setLoading(false);
    }
  }, []);

  // Load patient examinations
  const loadPatientExaminations = useCallback(async (patientId: number) => {
    try {
      setLoading(true);
      const data = await examinationService.getPatientExaminations(patientId);
      setExaminations(data);
    } catch (err) {
      console.error('Error loading patient examinations:', err);
      setError('Error al cargar exámenes del paciente');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load examination details
  const loadExaminationDetails = useCallback(async (
    examinationId: string
  ): Promise<MedicalExaminationWithResults | null> => {
    try {
      setLoading(true);
      return await examinationService.getExaminationDetails(examinationId);
    } catch (err) {
      console.error('Error loading examination details:', err);
      setError('Error al cargar detalles del examen');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load examination results
  const loadExaminationResults = useCallback(async (medicalHistoryId: number) => {
    try {
      setLoading(true);
      const data = await examinationService.getExaminationResults(medicalHistoryId);
      setExaminationResults(data);
    } catch (err) {
      console.error('Error loading examination results:', err);
      setError('Error al cargar resultados de exámenes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    laboratories,
    typeOfExams,
    examinations,
    examinationResults,
    loadLaboratories,
    loadTypeOfExams,
    createExamination,
    loadPatientExaminations,
    loadExaminationDetails,
    loadExaminationResults,
    clearError
  };
};