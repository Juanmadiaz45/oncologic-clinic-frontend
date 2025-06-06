import { BaseEntity } from '../core/api';
import { UserResponseDTO } from '../auth/responses';
import { StatusType } from '@/constants';


export interface PersonalResponseDTO extends BaseEntity {
  idNumber: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfHiring: string;
  status: StatusType;
  userData: UserResponseDTO;
  availabilityIds: number[];
}

export interface SpecialityResponseDTO extends BaseEntity {
  name: string;
  description: string;
  doctorIds: number[];
}

export interface DoctorResponseDTO extends BaseEntity {
  medicalLicenseNumber: string;
  specialityIds: number[];
  personalData: PersonalResponseDTO;
}

export interface AdministrativeResponseDTO extends BaseEntity {
  position: string;
  department: string;
  personalData: PersonalResponseDTO;
}

export interface PersonalDTO {
  userData: {
    username: string;
    password: string;
    roleIds: number[];
  };
  idNumber: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfHiring: string;
  status: StatusType;
  availabilityIds: number[];
}

export interface DoctorDTO {
  personalData: PersonalDTO;
  medicalLicenseNumber: string;
  specialityIds: number[];
}

export interface AdministrativeDTO {
  personalData: PersonalDTO;
  position: string;
  department: string;
}

export interface BasePersonalFormData {
  idNumber: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfHiring: string;
  status: StatusType;
  availabilityIds: number[];
}

export interface PersonalFormData extends BasePersonalFormData {
  username: string;
  password: string;
  confirmPassword: string;
  roleIds: number[];
}

export interface PersonalEditFormDataBase extends BasePersonalFormData {
  id: number;
}

export interface DoctorFormData extends PersonalFormData {
  medicalLicenseNumber: string;
  specialityIds: number[];
}

export interface DoctorEditFormData extends PersonalEditFormDataBase {
  medicalLicenseNumber: string;
  specialityIds: number[];
}

export interface AdministrativeFormData extends PersonalFormData {
  position: string;
  department: string;
}

export interface AdministrativeEditFormData extends PersonalEditFormDataBase {
  position: string;
  department: string;
}

export type PersonalResponse = DoctorResponseDTO | AdministrativeResponseDTO;
export type PersonalCreateRequest = DoctorDTO | AdministrativeDTO;
export type PersonalUpdateRequest = Partial<DoctorDTO> | Partial<AdministrativeDTO>;
export type PersonalCreateFormData = DoctorFormData | AdministrativeFormData;
export type PersonalEditFormData = DoctorEditFormData | AdministrativeEditFormData;

export enum PersonalType {
  DOCTOR = 'DOCTOR',
  ADMINISTRATIVE = 'ADMINISTRATIVE'
}

export interface SpecialityDTO {
  name: string;
  description: string;
  doctorIds: number[];
}

export interface CreateSpecialityRequest {
  name: string;
  description: string;
  doctorIds?: number[];
}

export interface UpdateSpecialityRequest {
  name?: string;
  description?: string;
  doctorIds?: number[];
}