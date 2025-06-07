import React from 'react';
import { 
  CalendarDaysIcon, 
  HeartIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import MetricCard from '@/components/ui/MetricCard';

interface MedicalHistoryStatsProps {
  stats: {
    totalAppointments: number;
    totalTreatments: number;
    activeTreatments: number;
    totalObservations: number;
    totalExaminations: number;
  };
  loading: boolean;
}

export const MedicalHistoryStats: React.FC<MedicalHistoryStatsProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <MetricCard
        value={loading ? "..." : stats.totalAppointments ?? 0}
        label="Citas Médicas"
        color="clinic"
        icon={<CalendarDaysIcon className="h-6 w-6" />}
      />
      <MetricCard
        value={loading ? "..." : stats.totalTreatments}
        label="Tratamientos"
        color="purple"
        icon={<HeartIcon className="h-6 w-6" />}
      />
      <MetricCard
        value={loading ? "..." : stats.activeTreatments}
        label="Activos"
        color="green"
        icon={<CheckCircleIcon className="h-6 w-6" />}
      />
      <MetricCard
        value={loading ? "..." : stats.totalObservations}
        label="Observaciones"
        color="yellow"
        icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
      />
      <MetricCard
        value={loading ? "..." : stats.totalExaminations}
        label="Exámenes"
        color="red"
        icon={<BeakerIcon className="h-6 w-6" />}
      />
    </div>
  );
};