// src/components/ui/AppLoadingScreen.tsx
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface AppLoadingScreenProps {
  message?: string;
}

export const AppLoadingScreen = ({
  message = 'Iniciando aplicación...',
}: AppLoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ArrowPathIcon className="mx-auto h-12 w-12 text-clinic-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">{message}</p>
      </div>
    </div>
  );
};
