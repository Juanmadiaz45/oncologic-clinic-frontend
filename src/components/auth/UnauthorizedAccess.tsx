// src/components/auth/UnauthorizedAccess.tsx
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

const UnauthorizedAccess = () => {
  const { currentUser, userRoles } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acceso Denegado
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Usuario: {currentUser?.username}
            <br />
            Roles: {userRoles.join(', ')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
