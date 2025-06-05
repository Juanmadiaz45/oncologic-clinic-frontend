import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  UsersIcon, 
  BeakerIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '@/constants';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  color: 'blue' | 'green' | 'purple' | 'gray';
}

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'new-consultation',
      label: 'Crear paciente',
      icon: <PlusIcon className="h-6 w-6" />,
      route: ROUTES.APPOINTMENT_CREATE,
      color: 'blue'
    },
    {
      id: 'view-patients',
      label: 'Ver Pacientes',
      icon: <UsersIcon className="h-6 w-6" />,
      route: ROUTES.PATIENTS,
      color: 'green'
    },
    {
      id: 'schedule-an-appointment',
      label: 'Agendar cita',
      icon: <BeakerIcon className="h-6 w-6" />,
      route: ROUTES.RESULTS,
      color: 'purple'
    },
  ];

  const getColorClasses = (color: QuickAction['color']) => {
    const colorConfig = {
      blue: {
        bg: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-white'
      },
      green: {
        bg: 'bg-green-600 hover:bg-green-700',
        text: 'text-white'
      },
      purple: {
        bg: 'bg-purple-600 hover:bg-purple-700',
        text: 'text-white'
      },
      gray: {
        bg: 'bg-gray-600 hover:bg-gray-700',
        text: 'text-white'
      }
    };
    return colorConfig[color];
  };

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map(action => {
          const colorClasses = getColorClasses(action.color);
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.route)}
              className={`${colorClasses.bg} ${colorClasses.text} p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <div className="flex flex-col items-center space-y-2">
                {action.icon}
                <span className="text-sm font-medium text-center">
                  {action.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;