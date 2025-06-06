import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import {
  DoctorResponseDTO,
  AdministrativeResponseDTO,
  DoctorDTO,
  AdministrativeDTO,
  SpecialityResponseDTO,
  CreateSpecialityRequest,
  UpdateSpecialityRequest,
} from '@/types';

class DoctorService {
  async getAllDoctors(): Promise<DoctorResponseDTO[]> {
    return api.get<DoctorResponseDTO[]>(API_ENDPOINTS.DOCTORS);
  }

  async getDoctorById(id: number): Promise<DoctorResponseDTO> {
    return api.get<DoctorResponseDTO>(`${API_ENDPOINTS.DOCTORS}/${id}`);
  }

  async createDoctor(data: DoctorDTO): Promise<DoctorResponseDTO> {
    console.log('🔍 DoctorService.createDoctor - Datos enviados:', JSON.stringify(data, null, 2));
    console.log('🔍 Endpoint:', API_ENDPOINTS.DOCTORS);
    
    try {
      const response = await api.post<DoctorResponseDTO>(API_ENDPOINTS.DOCTORS, data);
      console.log('✅ DoctorService.createDoctor - Respuesta exitosa:', response);
      return response;
    } catch (error) {
      console.error('❌ DoctorService.createDoctor - Error:', error);
      throw error;
    }
  }

  async updateDoctor(id: number, data: Partial<DoctorDTO>): Promise<DoctorResponseDTO> {
    console.log('🔍 DoctorService.updateDoctor - ID:', id, 'Datos:', JSON.stringify(data, null, 2));
    return api.put<DoctorResponseDTO>(`${API_ENDPOINTS.DOCTORS}/${id}`, data);
  }

  async deleteDoctor(id: number): Promise<void> {
    return api.delete(`${API_ENDPOINTS.DOCTORS}/${id}`);
  }
}

class AdministrativeService {
  async getAllAdministrative(): Promise<AdministrativeResponseDTO[]> {
    return api.get<AdministrativeResponseDTO[]>(API_ENDPOINTS.ADMINISTRATIVE);
  }

  async getAdministrativeById(id: number): Promise<AdministrativeResponseDTO> {
    return api.get<AdministrativeResponseDTO>(`${API_ENDPOINTS.ADMINISTRATIVE}/${id}`);
  }

  async createAdministrative(data: AdministrativeDTO): Promise<AdministrativeResponseDTO> {
    console.log('🔍 AdministrativeService.createAdministrative - Datos enviados:', JSON.stringify(data, null, 2));
    console.log('🔍 Endpoint:', API_ENDPOINTS.ADMINISTRATIVE);
    
    try {
      const response = await api.post<AdministrativeResponseDTO>(API_ENDPOINTS.ADMINISTRATIVE, data);
      console.log('✅ AdministrativeService.createAdministrative - Respuesta exitosa:', response);
      return response;
    } catch (error) {
      console.error('❌ AdministrativeService.createAdministrative - Error:', error);
      throw error;
    }
  }

  async updateAdministrative(id: number, data: Partial<AdministrativeDTO>): Promise<AdministrativeResponseDTO> {
    console.log('🔍 AdministrativeService.updateAdministrative - ID:', id, 'Datos:', JSON.stringify(data, null, 2));
    return api.put<AdministrativeResponseDTO>(`${API_ENDPOINTS.ADMINISTRATIVE}/${id}`, data);
  }

  async deleteAdministrative(id: number): Promise<void> {
    return api.delete(`${API_ENDPOINTS.ADMINISTRATIVE}/${id}`);
  }
}

class SpecialityService {
  async getAllSpecialities(): Promise<SpecialityResponseDTO[]> {
    return api.get<SpecialityResponseDTO[]>(API_ENDPOINTS.SPECIALITIES);
  }

  async getSpecialityById(id: number): Promise<SpecialityResponseDTO> {
    return api.get<SpecialityResponseDTO>(`${API_ENDPOINTS.SPECIALITIES}/${id}`);
  }

  async createSpeciality(data: CreateSpecialityRequest): Promise<SpecialityResponseDTO> {
    return api.post<SpecialityResponseDTO>(API_ENDPOINTS.SPECIALITIES, data);
  }

  async updateSpeciality(id: number, data: UpdateSpecialityRequest): Promise<SpecialityResponseDTO> {
    return api.put<SpecialityResponseDTO>(`${API_ENDPOINTS.SPECIALITIES}/${id}`, data);
  }

  async deleteSpeciality(id: number): Promise<void> {
    return api.delete(`${API_ENDPOINTS.SPECIALITIES}/${id}`);
  }
}

class PersonalService {
  async getAllPersonal(): Promise<(DoctorResponseDTO | AdministrativeResponseDTO)[]> {
    const [doctors, administrative] = await Promise.all([
      this.doctor.getAllDoctors(),
      this.administrative.getAllAdministrative()
    ]);

    const doctorsWithType = doctors.map(doctor => ({ ...doctor, type: 'DOCTOR' as const }));
    const administrativeWithType = administrative.map(admin => ({ ...admin, type: 'ADMINISTRATIVE' as const }));

    return [...doctorsWithType, ...administrativeWithType];
  }

  doctor = new DoctorService();
  administrative = new AdministrativeService();
  speciality = new SpecialityService();
}

const personalService = new PersonalService();
export const doctorService = personalService.doctor;
export const administrativeService = personalService.administrative;
export const specialityService = personalService.speciality;
export default personalService;