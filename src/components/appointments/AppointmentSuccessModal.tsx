import React from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface AppointmentSuccessModalProps {
  isOpen: boolean;
  appointmentData: {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    office: string;
    duration: number;
  };
  onClose: () => void;
}

const AppointmentSuccessModal: React.FC<AppointmentSuccessModalProps> = ({
  isOpen,
  appointmentData,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                ¡Cita Médica Creada!
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-green-500 hover:text-green-700 transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 mb-6 text-center">
            La cita médica ha sido agendada exitosamente
          </p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Paciente:
              </span>
              <span className="text-sm text-gray-900">
                {appointmentData.patientName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Doctor:</span>
              <span className="text-sm text-gray-900">
                {appointmentData.doctorName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Fecha:</span>
              <span className="text-sm text-gray-900">
                {formatDateForDisplay(appointmentData.date)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Hora:</span>
              <span className="text-sm text-gray-900">
                {appointmentData.time}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Consultorio:
              </span>
              <span className="text-sm text-gray-900">
                {appointmentData.office}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Duración:
              </span>
              <span className="text-sm text-gray-900">
                {appointmentData.duration} minutos
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex space-x-3">
            <Button onClick={onClose} variant="secondary" className="flex-1">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccessModal;
