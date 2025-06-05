import React from 'react';

interface MetricCardProps {
  value: number | string;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  value, 
  label, 
  color = 'blue', 
  icon 
}) => {
  const colorClasses = {
    blue: 'border-l-blue-500 bg-blue-50',
    green: 'border-l-green-500 bg-green-50',
    yellow: 'border-l-yellow-500 bg-yellow-50',
    red: 'border-l-red-500 bg-red-50',
    purple: 'border-l-purple-500 bg-purple-50'
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`card border-l-4 ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold ${textColorClasses[color]}`}>
            {value}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {label}
          </div>
        </div>
        {icon && (
          <div className={`text-2xl ${textColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;