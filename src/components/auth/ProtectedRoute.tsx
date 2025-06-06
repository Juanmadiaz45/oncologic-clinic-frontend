// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // If true, requires all roles/permissions. If false, requires at least one
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
}) => {
  const {
    isAuthenticated,
    currentUser,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check roles if specified
  if (roles.length > 0) {
    const hasRequiredRoles = requireAll
      ? hasAllRoles(roles)
      : hasAnyRole(roles);

    if (!hasRequiredRoles) {
      return <UnauthorizedAccess />;
    }
  }

  // Check permissions if specified
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasRequiredPermissions) {
      return <UnauthorizedAccess />;
    }
  }

  return <>{children}</>;
};

// Component to show when user doesn't have permissions
const UnauthorizedAccess: React.FC = () => {
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

export default ProtectedRoute;
