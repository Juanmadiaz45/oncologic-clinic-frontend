import { useState, useEffect } from 'react';
import personalService, { doctorService, administrativeService, specialityService } from '@/services/api/personalService';
import { ApiError } from '@/types/core/errors';
import { 
  DoctorResponseDTO, 
  AdministrativeResponseDTO, 
  SpecialityResponseDTO
} from '@/types/personal';

// Hook to get all the personal
export const usePersonal = () => {
  const [personal, setPersonal] = useState<(DoctorResponseDTO | AdministrativeResponseDTO)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonal = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await personalService.getAllPersonal();
      setPersonal(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar personal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonal();
  }, []);

  return {
    personal,
    loading,
    error,
    refetch: fetchPersonal
  };
};

// Hook for Doctors
export const useDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar doctores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors
  };
};

// Hook for administratives
export const useAdministrative = () => {
  const [administrative, setAdministrative] = useState<AdministrativeResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdministrative = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await administrativeService.getAllAdministrative();
      setAdministrative(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar personal administrativo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministrative();
  }, []);

  return {
    administrative,
    loading,
    error,
    refetch: fetchAdministrative
  };
};

// Hook for specialties
export const useSpecialities = () => {
  const [specialities, setSpecialities] = useState<SpecialityResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await specialityService.getAllSpecialities();
      setSpecialities(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar especialidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  return {
    specialities,
    loading,
    error,
    refetch: fetchSpecialities
  };
};

// Hook to get a specific doctor
export const useDoctor = (id?: number) => {
  const [doctor, setDoctor] = useState<DoctorResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctor = async (doctorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getDoctorById(doctorId);
      setDoctor(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar doctor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDoctor(id);
    }
  }, [id]);

  return {
    doctor,
    loading,
    error,
    refetch: () => id && fetchDoctor(id)
  };
};

// Hook to get a specific administrative
export const useAdministrativeById = (id?: number) => {
  const [administrative, setAdministrative] = useState<AdministrativeResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdministrative = async (adminId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await administrativeService.getAdministrativeById(adminId);
      setAdministrative(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al cargar administrativo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdministrative(id);
    }
  }, [id]);

  return {
    administrative,
    loading,
    error,
    refetch: () => id && fetchAdministrative(id)
  };
};