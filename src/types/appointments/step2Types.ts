import { BaseEntity } from '../core/api';

export interface Doctor extends BaseEntity {
  personalData: {
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  medicalLicenseNumber: string;
  specialityIds: number[];
  specialityNames?: string[];
}

export interface DoctorAvailability extends BaseEntity {
  doctorId: number;
  dayOfWeek: string; // 'MONDAY', 'TUESDAY', etc.
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  status: 'A' | 'I';
}

export interface TimeSlot {
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  available: boolean;
}

export interface AvailableOfficesRequest {
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}
