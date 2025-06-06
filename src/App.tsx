import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import {
  PatientListPage,
  PatientCreatePage,
  PatientEditPage,
  PatientDetailPage
} from '@/pages/patients';
import {
  PersonalListPage,
  DoctorCreatePage,
  AdministrativeCreatePage,
  DoctorEditPage,
  AdministrativeEditPage,
  DoctorDetailPage,
  AdministrativeDetailPage
} from '@/pages/staff';
import { ROUTES } from '@/constants';

function App() {
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
          <Route path={ROUTES.ADMINISTRATIVE_CREATE} element={<AdministrativeCreatePage />} />
          <Route path="/staff/administrative/:id/edit" element={<AdministrativeEditPage />} />
          <Route path="/staff/administrative/:id" element={<AdministrativeDetailPage />} />

          {/* Default redirect to login */}
          <Route
            path={ROUTES.HOME}
            element={<Navigate to={ROUTES.LOGIN} replace />}
          />

          {/* Dashboard with navigation */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Dashboard - Sistema OncoLogic</h1>
                <div className="space-x-4">
                  <a 
                    href={ROUTES.PATIENTS}
                    className="btn btn-primary"
                  >
                    Ver Pacientes
                  </a>
                  <a 
                    href="/staff/personal"
                    className="btn btn-secondary"
                  >
                    Ver Personal
                  </a>
                </div>
              </div>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
