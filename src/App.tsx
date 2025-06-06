// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { AppLoadingScreen } from '@/components/ui/AppLoadingScreen';
import LoginPage from '@/pages/auth/LoginPage';
import DoctorDashboard from '@/pages/dashboard/DoctorDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppointmentStep1 from '@/pages/appointments/create/AppointmentStep1';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

function App() {
  const { initialize, isInitialized, isLoading, isAuthenticated } = useAuth();

  // Initialize auth on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return <AppLoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Appointment Routes */}
          <Route
            path={ROUTES.APPOINTMENT_CREATE_STEP1}
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ADMINISTRATIVE']}>
                <AppointmentStep1 />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={ROUTES.DASHBOARD} replace />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to={ROUTES.DASHBOARD} replace />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
