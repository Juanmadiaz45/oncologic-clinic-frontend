import { useState, useEffect } from 'react';
import patientService from '@/services/api/patientService';
import { PatientResponse } from '@/types/patients/extended';
import { ApiError } from '@/types/core/errors';

export const usePatients = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients
  };
};