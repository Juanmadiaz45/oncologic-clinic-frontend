import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import UnauthorizedAccess from './UnauthorizedAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
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

export default ProtectedRoute;
