import React from 'react';

interface MetricCardProps {
  value: number | string;
  label: string;
  color?: 'clinic' | 'green' | 'yellow' | 'red' | 'purple';
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  value, 
  label, 
  color = 'clinic', 
  icon
}) => {
  const colorClasses = {
    clinic: 'border-l-clinic-500 bg-gradient-to-br from-clinic-50 to-white',
    green: 'border-l-green-500 bg-gradient-to-br from-green-50 to-white',
    yellow: 'border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white',
    red: 'border-l-red-500 bg-gradient-to-br from-red-50 to-white',
    purple: 'border-l-purple-500 bg-gradient-to-br from-purple-50 to-white'
  };

  const textColorClasses = {
    clinic: 'text-clinic-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  const iconColorClasses = {
    clinic: 'text-clinic-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500'
  };

  return (
    <div className={`bg-white rounded-xl shadow-card border border-gray-200 border-l-4 ${colorClasses[color]} p-6 hover:shadow-soft transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`text-3xl font-bold ${textColorClasses[color]}`}>
            {value}
          </div>
          <div className="text-sm font-medium text-gray-600 mt-2">
            {label}
          </div>
        </div>
        {icon && (
          <div className={`flex-shrink-0 p-3 rounded-lg bg-white shadow-sm ${iconColorClasses[color]}`}>
            <div className="h-6 w-6">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;