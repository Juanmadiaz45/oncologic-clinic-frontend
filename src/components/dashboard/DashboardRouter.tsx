import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import DoctorDashboard from '@/pages/dashboard/DoctorDashboard';
import AdministrativeDashboard from '@/pages/dashboard/AdministrativeDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';

export const DashboardRouter: React.FC = () => {
  const { isAdmin, isDoctor, isAdministrative } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  } else if (isDoctor) {
    return <DoctorDashboard />;
  } else if (isAdministrative) {
    return <AdministrativeDashboard />;
  } else {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
};
