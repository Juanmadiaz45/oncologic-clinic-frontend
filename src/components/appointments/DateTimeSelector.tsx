import React from 'react';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { TimeSlot } from '@/types/appointments/step2Types';

interface DateTimeSelectorProps {
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  availableTimeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
  onDateChange: (date: string) => void;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTimeSlot,
  availableTimeSlots,
  isLoadingTimeSlots,
  onDateChange,
  onTimeSlotSelect,
}) => {
  // Get tomorrow's date as minimum selectable date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get formatted date for display
  const getFormattedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seleccionar Fecha y Hora
        </h3>

        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de la Cita
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate || ''}
              min={getTomorrowDate()}
              onChange={e => onDateChange(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 transition-colors duration-200"
            />
            <CalendarDaysIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          {selectedDate && (
            <p className="mt-2 text-sm text-gray-600">
              {getFormattedDate(selectedDate)}
            </p>
          )}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Horarios Disponibles
            </label>

            {isLoadingTimeSlots ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-clinic-500"></div>
                <span className="ml-2 text-gray-600">Cargando horarios...</span>
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p className="text-sm">
                  No hay horarios disponibles para esta fecha
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Intente seleccionar otra fecha
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                {availableTimeSlots.map((timeSlot, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      timeSlot.available && onTimeSlotSelect(timeSlot)
                    }
                    disabled={!timeSlot.available}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      selectedTimeSlot?.startTime === timeSlot.startTime
                        ? 'border-clinic-500 bg-clinic-50 text-clinic-700'
                        : timeSlot.available
                        ? 'border-gray-200 bg-white text-gray-700 hover:border-clinic-300 hover:bg-clinic-50'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{timeSlot.startTime}</span>
                    </div>
                    <div className="text-xs mt-1">
                      {timeSlot.available ? 'Disponible' : 'Ocupado'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Time Display */}
        {selectedTimeSlot && (
          <div className="mt-4 bg-clinic-50 border border-clinic-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-clinic-800 mb-2">
              Horario Seleccionado
            </h4>
            <div className="flex items-center space-x-2 text-clinic-700">
              <ClockIcon className="h-5 w-5" />
              <span className="font-medium">
                {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
              </span>
            </div>
            {selectedDate && (
              <p className="text-sm text-clinic-600 mt-1">
                {getFormattedDate(selectedDate)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
