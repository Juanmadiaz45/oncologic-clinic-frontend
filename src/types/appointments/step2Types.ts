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

export interface Availability extends BaseEntity {
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  personalIds: number[];
  status: Status;
}

export interface Status extends BaseEntity {
  name: string; // e.g., 'PENDING', 'CONFIRMED', 'CANCELLED'
  availabilityIds?: number[];
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
