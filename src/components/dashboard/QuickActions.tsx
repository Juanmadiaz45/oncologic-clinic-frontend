import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  CalendarIcon,
  BeakerIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '@/constants';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  color: 'clinic' | 'green' | 'purple';
}

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'view-patients',
      label: 'Ver Pacientes',
      icon: <UsersIcon className="h-5 w-5" />,
      route: ROUTES.PATIENTS,
      color: 'green'
    }
  ];

  const getColorClasses = (color: QuickAction['color']) => {
    const colorConfig = {
      clinic: {
        bg: 'bg-gradient-to-br from-clinic-500 to-clinic-600 hover:from-clinic-600 hover:to-clinic-700',
        text: 'text-white',
        shadow: 'shadow-clinic-500/25'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        text: 'text-white',
        shadow: 'shadow-green-500/25'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
        text: 'text-white',
        shadow: 'shadow-purple-500/25'
      }
    };
    return colorConfig[color];
  };

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <BoltIcon className="h-5 w-5 text-clinic-500" />
        <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
      </div>
      
      <div className="space-y-3">
        {actions.map(action => {
          const colorClasses = getColorClasses(action.color);
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.route)}
              className={`${colorClasses.bg} ${colorClasses.text} w-full p-3 rounded-lg shadow-lg ${colorClasses.shadow} transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clinic-500 group`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-white/20 rounded group-hover:bg-white/30 transition-colors duration-200">
                  {action.icon}
                </div>
                <div className="text-sm font-semibold">
                  {action.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;