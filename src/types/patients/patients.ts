import { BaseEntity } from '../core/api';
import { GenderType } from '@/constants';
import { User } from '@/types';
import { MedicalHistory } from '@/types';

// Patient Types
export interface Patient extends BaseEntity {
  idNumber: string;
  userData: User;
  name: string;
  birthDate: string;
  gender: GenderType;
  address: string;
  phoneNumber: string;
  email: string;
  medicalHistory: MedicalHistory;
}
