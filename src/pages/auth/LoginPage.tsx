import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/components/forms/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <AuthLayout title="¡Bienvenido!">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
