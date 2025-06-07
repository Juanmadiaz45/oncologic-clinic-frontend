import { MedicalHistoryDetail } from '@/types/medicalHistory';

export interface MedicalHistoryState {
  medicalHistory: MedicalHistoryDetail | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  currentPatientId: number | null;
}

export const initialState: MedicalHistoryState = {
  medicalHistory: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  currentPatientId: null
};