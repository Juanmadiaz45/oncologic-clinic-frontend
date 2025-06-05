import React, { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { AppointmentSummary } from '@/types/dashboard';

interface TodayAppointmentsProps {
  appointments: AppointmentSummary[];
}

type TabType = 'all' | 'scheduled' | 'completed';

const TodayAppointments: React.FC<TodayAppointmentsProps> = ({ appointments }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredAppointments = appointments.filter(appointment => {
    switch (activeTab) {
      case 'scheduled':
        return appointment.status === 'SCHEDULED';
      case 'completed':
        return appointment.status === 'COMPLETED';
      default:
        return true;
    }
  });

  const getStatusBadge = (status: AppointmentSummary['status']) => {
    const statusConfig = {
      SCHEDULED: { bg: 'bg-clinic-100', text: 'text-clinic-800', label: 'Programada' },
      IN_PROGRESS: { bg: 'bg-green-100', text: 'text-green-800', label: 'En curso' },
      COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const tabs = [
    { key: 'all' as TabType, label: 'Todas', count: appointments.length },
    { key: 'scheduled' as TabType, label: 'Programadas', count: appointments.filter(a => a.status === 'SCHEDULED').length },
    { key: 'completed' as TabType, label: 'Completadas', count: appointments.filter(a => a.status === 'COMPLETED').length }
  ];

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Citas de Hoy</h3>
      </div>
      
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex px-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 relative ${
                activeTab === tab.key
                  ? 'border-clinic-500 text-clinic-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.key 
                    ? 'bg-clinic-100 text-clinic-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-400">No hay citas para mostrar</p>
            <p className="text-sm text-gray-400 mt-1">Las citas aparecerán aquí cuando estén programadas</p>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-lg font-semibold text-clinic-600 min-w-[80px]">
                  {appointment.time}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-lg">
                    {appointment.patientName}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <span>{appointment.appointmentType}</span>
                    {appointment.office && (
                      <>
                        <span>•</span>
                        <span>{appointment.office}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;