import React, { useState } from 'react';
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
      SCHEDULED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Programada' },
      IN_PROGRESS: { bg: 'bg-green-100', text: 'text-green-800', label: 'En curso' },
      COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
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
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas de Hoy</h3>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay citas para mostrar</p>
          </div>
        ) : (
          filteredAppointments.map(appointment => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-blue-600 min-w-[60px]">
                  {appointment.time}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {appointment.patientName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.appointmentType}
                    {appointment.office && ` • ${appointment.office}`}
                  </div>
                </div>
              </div>
              <div>
                {getStatusBadge(appointment.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;