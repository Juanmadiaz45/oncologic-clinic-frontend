import { BaseEntity } from '@/types';

export interface MedicalOffice extends BaseEntity {
  name: string;
  location: string;
  equipment?: string;
  status: 'A' | 'I';
}
