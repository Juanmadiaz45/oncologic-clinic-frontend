import React from 'react';
import {
  CalendarDaysIcon,
  ArrowLeftIcon,
  CheckIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import UserDropdown from '../ui/UserDropdown';

interface AppointmentHeaderProps {
  title: string;
  step: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBackButton?: boolean;
}

interface ProgressStepProps {
  stepNumber: number;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepIcon: React.ReactNode;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  stepNumber,
  currentStep,
  totalSteps,
  stepTitle,
  stepIcon,
}) => {
  const isCompleted = stepNumber < currentStep;
  const isCurrent = stepNumber === currentStep;

  return (
    <div className="flex items-center">
      {/* Step Circle */}
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
            isCompleted
              ? 'bg-clinic-500 text-white shadow-lg transform scale-105'
              : isCurrent
              ? 'bg-clinic-500 text-white shadow-lg ring-4 ring-clinic-100 animate-pulse'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {isCompleted ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <span className="text-xs font-bold">{stepNumber}</span>
          )}
        </div>

        {/* Step Icon */}
        <div
          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
            isCompleted || isCurrent
              ? 'bg-white text-clinic-500 shadow-sm'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <div className="w-3 h-3">{stepIcon}</div>
        </div>
      </div>

      {/* Step Title */}
      <div className="ml-3 hidden md:block">
        <div
          className={`text-sm font-medium transition-colors duration-300 ${
            isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {stepTitle}
        </div>
        <div
          className={`text-xs transition-colors duration-300 ${
            isCurrent ? 'text-clinic-600' : 'text-gray-400'
          }`}
        >
          {isCurrent ? 'En progreso' : isCompleted ? 'Completado' : 'Pendiente'}
        </div>
      </div>

      {/* Connector Line */}
      {stepNumber < totalSteps && (
        <div className="flex-1 mx-4 md:mx-6">
          <div className="relative">
            <div className="h-0.5 bg-gray-200 rounded-full"></div>
            <div
              className={`absolute top-0 left-0 h-0.5 rounded-full transition-all duration-700 ease-out ${
                stepNumber < currentStep
                  ? 'bg-clinic-500 w-full'
                  : 'bg-transparent w-0'
              }`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  title,
  step,
  currentStep,
  totalSteps,
  onBack,
  showBackButton = true,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
    // If there is no onBack function, the parent should handle the navigation
  };

  const steps = [
    {
      title: 'Seleccionar Paciente',
      icon: <UserGroupIcon className="w-full h-full" />,
    },
    {
      title: 'Agendar Horario',
      icon: <ClockIcon className="w-full h-full" />,
    },
  ];

  const getProgressPercentage = () => {
    if (currentStep === 1) return 0;
    if (currentStep === 2) return 50;
    return 100; // Appointment created
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-clinic-500 to-clinic-600 transition-all duration-700 ease-out"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-400 hover:text-clinic-600 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                  title="Volver"
                >
                  <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                </button>
              )}

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-clinic-50 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-clinic-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                  <p className="text-sm text-gray-600 mt-0.5">{step}</p>
                </div>
              </div>
            </div>

            {/* Progress bar with steps */}
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-2xl">
                {steps.map((stepInfo, index) => (
                  <ProgressStep
                    key={index + 1}
                    stepNumber={index + 1}
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    stepTitle={stepInfo.title}
                    stepIcon={stepInfo.icon}
                  />
                ))}
              </div>
            </div>

            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};
