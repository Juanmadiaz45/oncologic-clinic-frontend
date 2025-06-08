import React from 'react';
import { 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon,
  BeakerIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import MetricCard from '@/components/ui/MetricCard';

interface MedicalHistoryStatsProps {
  stats: {
    totalAppointments: number;
    totalExaminations: number;
    totalAppointmentResults: number;
    totalExaminationResults: number;
  };
  loading: boolean;
}

export const MedicalHistoryStats: React.FC<MedicalHistoryStatsProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <MetricCard
        value={loading ? "..." : stats.totalAppointments}
        label="Citas Médicas"
        color="clinic"
        icon={<CalendarDaysIcon className="h-6 w-6" />}
      />
      <MetricCard
        value={loading ? "..." : stats.totalExaminations}
        label="Exámenes Médicos"
        color="purple"
        icon={<BeakerIcon className="h-6 w-6" />}
      />
      <MetricCard
        value={loading ? "..." : stats.totalAppointmentResults}
        label="Resultados de Citas"
        color="green"
        icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
      />
      <MetricCard
        value={loading ? "..." : stats.totalExaminationResults}
        label="Resultados de Exámenes"
        color="yellow"
        icon={<DocumentChartBarIcon className="h-6 w-6" />}
      />
    </div>
  );
};