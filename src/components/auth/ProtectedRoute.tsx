// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import authService from '@/services/auth/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // Si true, requiere todos los roles/permisos. Si false, requiere al menos uno
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  permissions = [],
  requireAll = false
}) => {
  const currentUser = authService.getCurrentUser();

  console.log('ProtectedRoute - Current user:', currentUser); // Para debug
  console.log('ProtectedRoute - Required roles:', roles); // Para debug

  // Si no está autenticado, redirigir al login
  if (!authService.isAuthenticated() || !currentUser) {
    console.log('ProtectedRoute - User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Verificar roles si se especificaron
  if (roles.length > 0) {
    const hasRequiredRoles = requireAll
      ? authService.hasAllRoles(roles)
      : authService.hasAnyRole(roles);

    console.log('ProtectedRoute - Has required roles:', hasRequiredRoles); // Para debug

    if (!hasRequiredRoles) {
      return <UnauthorizedAccess />;
    }
  }

  // Verificar permisos si se especificaron
  if (permissions.length > 0) {
    const userPermissions = authService.getPermissions();
    const hasRequiredPermissions = requireAll
      ? permissions.every(permission => userPermissions.includes(permission))
      : permissions.some(permission => userPermissions.includes(permission));

    console.log('ProtectedRoute - Has required permissions:', hasRequiredPermissions); // Para debug

    if (!hasRequiredPermissions) {
      return <UnauthorizedAccess />;
    }
  }

  return <>{children}</>;
};

// Componente para mostrar cuando no se tienen permisos
const UnauthorizedAccess: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  
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
            Usuario: {currentUser?.username}<br />
            Roles: {currentUser?.roles.join(', ')}
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

export default ProtectedRoute;