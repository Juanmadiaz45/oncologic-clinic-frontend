import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface ProtectedRouteConfig {
  path: string;
  element: React.ReactElement;
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
}

interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

export const createProtectedRoute = (
  config: ProtectedRouteConfig
): RouteConfig => {
  const { path, element, roles, permissions, requireAll } = config;

  return {
    path,
    element: (
      <ProtectedRoute
        roles={roles}
        permissions={permissions}
        requireAll={requireAll}
      >
        {element}
      </ProtectedRoute>
    ),
  };
};

export const createProtectedRoutes = (
  configs: ProtectedRouteConfig[]
): RouteConfig[] => {
  return configs.map(createProtectedRoute);
};
