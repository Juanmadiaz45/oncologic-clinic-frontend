import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { AppLoadingScreen } from '@/components/ui/AppLoadingScreen';
import LoginPage from '@/pages/auth/LoginPage';
import {
  PatientListPage,
  PatientCreatePage,
  PatientEditPage,
  PatientDetailPage,
} from '@/pages/patients';
import {
  PersonalListPage,
  DoctorCreatePage,
  AdministrativeCreatePage,
  DoctorEditPage,
  AdministrativeEditPage,
  DoctorDetailPage,
  AdministrativeDetailPage,
} from '@/pages/staff';
import DoctorDashboard from '@/pages/dashboard/DoctorDashboard';
import AdministrativeDashboard from '@/pages/dashboard/AdministrativeDashboard';
import MedicalAppointment from '@/pages/appointments/MedicalAppointment';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppointmentStep1 from '@/pages/appointments/create/AppointmentStep1';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

function App() {
  const { initialize, isInitialized, isLoading, isAuthenticated, isAdmin, isDoctor, isAdministrative } = useAuth();

  // Initialize auth on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return <AppLoadingScreen />;
  }

  // Helper function to determine which dashboard to show
  const getDashboardComponent = () => {
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

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Patient Routes */}
          <Route path={ROUTES.PATIENTS} element={<PatientListPage />} />
          <Route path={ROUTES.PATIENT_CREATE} element={<PatientCreatePage />} />
          <Route path={ROUTES.PATIENT_EDIT} element={<PatientEditPage />} />
          <Route path={ROUTES.PATIENT_DETAIL} element={<PatientDetailPage />} />

          {/* Personal Routes */}
          <Route path={ROUTES.PERSONAL} element={<PersonalListPage />} />
          <Route path="/staff/personal" element={<PersonalListPage />} />

          {/* Doctor Routes */}
          <Route path={ROUTES.DOCTOR_CREATE} element={<DoctorCreatePage />} />
          <Route path="/staff/doctors/:id/edit" element={<DoctorEditPage />} />
          <Route path="/staff/doctors/:id" element={<DoctorDetailPage />} />

          {/* Administrative Routes */}
          <Route
            path={ROUTES.ADMINISTRATIVE_CREATE}
            element={<AdministrativeCreatePage />}
          />
          <Route
            path="/staff/administrative/:id/edit"
            element={<AdministrativeEditPage />}
          />
          <Route
            path="/staff/administrative/:id"
            element={<AdministrativeDetailPage />}
          />

          {/* Protected Routes */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ADMINISTRATIVE']}>
                {getDashboardComponent()}
              </ProtectedRoute>
            } 
          />

          {/* Default redirect */}
          {/* Appointment Routes */}
          <Route
            path={ROUTES.APPOINTMENT_CREATE_STEP1}
            element={
              <ProtectedRoute
                children={<AppointmentStep1 />}
                roles={['ADMIN', 'DOCTOR', 'ADMINISTRATIVE']}
              ></ProtectedRoute>
            }
          />

          {/* Medical Appointment Route */}
          <Route
            path="/medical-appointment/:appointmentId"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
                <MedicalAppointment />
              </ProtectedRoute>
            }
          />

          {/* Dashboard with navigation */}
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
