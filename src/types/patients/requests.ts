import { GenderType } from '@/constants';
import { CreateUserRequest } from '../auth/requests';

export interface CreatePatientRequest {
  name: string;
  birthDate: string;
  gender: GenderType;
  address: string;
  phoneNumber: string;
  email: string;
  currentHealthStatus: string;
  userData: CreateUserRequest;
}

export interface UpdatePatientRequest {
  name?: string;
  birthDate?: string;
  gender?: GenderType;
  address?: string;
  phoneNumber?: string;
  email?: string;
}
