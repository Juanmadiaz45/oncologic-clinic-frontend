import { BaseEntity } from '../core/api';
import { GenderType } from '@/constants';
import { User } from '../auth/user';

// Patient Types
export interface Patient extends BaseEntity {
  name: string;
  birthdate: string;
  gender: GenderType;
  address: string;
  phoneNumber: string;
  email: string;
  user: User;
  // medicalHistory?: MedicalHistory;
}