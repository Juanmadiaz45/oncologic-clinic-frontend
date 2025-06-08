import { MedicalHistoryResponse } from '@/types/medicalHistory';
import { TimelineEvent } from '@/services/api/medicalHistoryDetailsService';

export interface MedicalHistoryState {
  medicalHistory: MedicalHistoryResponse | null;
  timelineEvents: TimelineEvent[];
  isLoading: boolean;
  isLoadingTimeline: boolean;
  error: string | null;
  timelineError: string | null;
  lastUpdated: string | null;
  timelineLastUpdated: string | null;
  currentPatientId: number | null;
}

export const initialState: MedicalHistoryState = {
  medicalHistory: null,
  timelineEvents: [],
  isLoading: false,
  isLoadingTimeline: false,
  error: null,
  timelineError: null,
  lastUpdated: null,
  timelineLastUpdated: null,
  currentPatientId: null
};