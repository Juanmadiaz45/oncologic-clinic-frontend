import React from 'react';
import { ClockIcon, MapPinIcon, CalendarDaysIcon, PlayIcon } from '@heroicons/react/24/outline';
import { NextAppointment as NextAppointmentType } from '@/types/dashboard';

interface NextAppointmentProps {
  nextAppointment: NextAppointmentType | null;
}

const NextAppointment: React.FC<NextAppointmentProps> = ({ nextAppointment }) => {
  const handleStartAppointment = () => {
    console.log('Comenzar cita médica');
    // Aquí irá la lógica para comenzar la cita
  };

  if (!nextAppointment) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6 h-full flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarDaysIcon className="h-5 w-5 text-clinic-500" />
          <h3 className="text-lg font-semibold text-gray-900">Próxima Cita</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-center text-gray-500">
          <div>
            <ClockIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-400 mb-2">No hay próximas citas</p>
            <p className="text-sm text-gray-400">Las citas aparecerán aquí cuando estén agendadas</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <CalendarDaysIcon className="h-5 w-5 text-clinic-500" />
        <h3 className="text-lg font-semibold text-gray-900">Próxima Cita</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-gradient-to-br from-clinic-50 to-clinic-100 border border-clinic-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-clinic-600 mb-2">
              {nextAppointment.time}
            </div>
            <div className="text-lg text-clinic-600 font-medium">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
            </div>
          </div>
          
          <div className="border-t border-clinic-200 pt-6 mb-6">
            <div className="font-bold text-gray-900 text-center mb-4 text-xl">
              {nextAppointment.patientName}
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-base text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-clinic-500" />
                <span className="font-medium">{nextAppointment.office}</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <span className="inline-block bg-white text-clinic-700 px-4 py-2 rounded-full text-sm font-medium border border-clinic-200">
                {nextAppointment.appointmentType}
              </span>
            </div>
          </div>

          <button
            onClick={handleStartAppointment}
            className="w-full bg-clinic-600 text-white py-3 px-6 rounded-lg hover:bg-clinic-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold text-base"
          >
            <PlayIcon className="h-5 w-5" />
            <span>Comenzar Cita Médica</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextAppointment;