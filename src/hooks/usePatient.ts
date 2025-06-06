import { useState, useEffect } from 'react';
import patientService from '@/services/api/patientService';
import { PatientResponse } from '@/types/patients/extended';
import { ApiError } from '@/types/core/errors';

export const usePatient = (id?: number) => {
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = async (patientId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar paciente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  return {
    patient,
    loading,
    error,
    refetch: () => id && fetchPatient(id)
  };
};