import React from 'react';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { NextAppointment as NextAppointmentType } from '@/types/dashboard';

interface NextAppointmentProps {
  nextAppointment: NextAppointmentType | null;
}

const NextAppointment: React.FC<NextAppointmentProps> = ({ nextAppointment }) => {
  if (!nextAppointment) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Próxima Cita</h3>
        <div className="text-center py-6 text-gray-500">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p>No hay próximas citas programadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Próxima Cita</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {nextAppointment.time}
          </div>
          <div className="text-sm text-blue-600 mb-3">
            Junio 2025<br />
            Lunes
          </div>
        </div>
        
        <div className="border-t border-blue-200 pt-3 mt-3">
          <div className="font-medium text-gray-900 text-center mb-2">
            {nextAppointment.patientName}
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{nextAppointment.office}</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-2">
            {nextAppointment.appointmentType}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextAppointment;