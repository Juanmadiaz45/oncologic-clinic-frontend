// src/components/appointments/RedirectStepGuard.tsx

import React, { useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

interface RedirectStepGuardProps {
  currentStep: number;
  onPrevStep: () => void;
}

const RedirectStepGuard: React.FC<RedirectStepGuardProps> = ({
  currentStep,
  onPrevStep,
}) => {
  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      onPrevStep();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onPrevStep]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowLeftIcon className="w-8 h-8 text-yellow-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información incompleta
        </h2>

        <p className="text-gray-600 mb-6">
          Debe completar el paso {currentStep - 1} antes de acceder al paso{' '}
          {currentStep}. Será redirigido automáticamente en unos segundos.
        </p>

        <Button
          onClick={onPrevStep}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Ir al Paso Anterior</span>
        </Button>
      </div>
    </div>
  );
};

export default RedirectStepGuard;
