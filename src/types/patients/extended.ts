import { BaseEntity } from '../core/api';
import { UserResponseDTO } from '../auth/responses';

export interface MedicalHistoryResponse extends BaseEntity {
  patientId: number;
  creationDate: string;
  currentHealthStatus: string;
  medicalAppointmentIds: number[];
  medicalExaminationIds: string[];
  appointmentResultIds: number[];
  examinationResultIds: number[];
}

export interface PatientResponse extends BaseEntity {
  idNumber: string;
  userData: UserResponseDTO;
  name: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
  address: string;
  phoneNumber: string;
  email: string;
  medicalHistory: MedicalHistoryResponse;
}

export interface CreatePatientRequest {
  idNumber: string;
  userData: {
    username: string;
    password: string;
    roleIds: number[];
  };
  name: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
  address: string;
  phoneNumber: string;
  email: string;
  currentHealthStatus: string;
}

export interface UpdatePatientRequest {
  idNumber?: string;
  name?: string;
  birthDate?: string;
  gender?: 'M' | 'F' | 'O';
  address?: string;
  phoneNumber?: string;
  email?: string;
}

export interface BasePatientFormData {
  idNumber: string;
  name: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
  address: string;
  phoneNumber: string;
  email: string;
}

export interface PatientFormData extends BasePatientFormData {
  currentHealthStatus: string;
  username: string;
  password: string;
  confirmPassword: string;
  roleIds: number[];
}

export interface PatientEditFormData extends BasePatientFormData {
  id: number;
}