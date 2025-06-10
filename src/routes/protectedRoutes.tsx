import { createProtectedRoutes } from '@/utils/routeUtils';
import { ROUTES, ROLES } from '@/constants';

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
import MedicalAppointment from '@/pages/appointments/MedicalAppointment';
import AppointmentStep1 from '@/pages/appointments/create/AppointmentStep1';
import AppointmentStep2 from '@/pages/appointments/create/AppointmentStep2';
import PatientMedicalHistoryPage from '@/pages/patients/PatientMedicalHistoryPage';
import { DashboardRouter } from '@/components/dashboard/DashboardRouter';

export const protectedRoutes = createProtectedRoutes([
  // =================
  // DASHBOARD ROUTES
  // =================
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardRouter />,
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.ADMINISTRATIVE],
  },

  // =================
  // PATIENT ROUTES
  // =================
  {
    path: ROUTES.PATIENTS,
    element: <PatientListPage />,
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.ADMINISTRATIVE],
  },
  {
    path: ROUTES.PATIENT_CREATE,
    element: <PatientCreatePage />,
    roles: [ROLES.ADMIN, ROLES.ADMINISTRATIVE],
  },
  {
    path: ROUTES.PATIENT_EDIT,
    element: <PatientEditPage />,
    roles: [ROLES.ADMIN, ROLES.ADMINISTRATIVE],
  },
  {
    path: ROUTES.PATIENT_DETAIL,
    element: <PatientDetailPage />,
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.ADMINISTRATIVE],
  },
  {
    path: '/patients/:id/medical-history',
    element: <PatientMedicalHistoryPage />,
    roles: [ROLES.ADMIN, ROLES.DOCTOR],
  },

  // =================
  // STAFF/PERSONAL ROUTES
  // =================
  {
    path: ROUTES.PERSONAL,
    element: <PersonalListPage />,
    roles: [ROLES.ADMIN],
  },

  // Doctor Routes
  {
    path: ROUTES.DOCTOR_CREATE,
    element: <DoctorCreatePage />,
    roles: [ROLES.ADMIN],
  },
  {
    path: '/staff/doctors/:id/edit',
    element: <DoctorEditPage />,
    roles: [ROLES.ADMIN],
  },
  {
    path: '/staff/doctors/:id',
    element: <DoctorDetailPage />,
    roles: [ROLES.ADMIN],
  },

  // Administrative Routes
  {
    path: ROUTES.ADMINISTRATIVE_CREATE,
    element: <AdministrativeCreatePage />,
    roles: [ROLES.ADMIN],
  },
  {
    path: '/staff/administrative/:id/edit',
    element: <AdministrativeEditPage />,
    roles: [ROLES.ADMIN],
  },
  {
    path: '/staff/administrative/:id',
    element: <AdministrativeDetailPage />,
    roles: [ROLES.ADMIN],
  },

  // =================
  // APPOINTMENT ROUTES
  // =================
  {
    path: ROUTES.APPOINTMENT_CREATE_STEP1,
    element: <AppointmentStep1 />,
    roles: [ROLES.ADMINISTRATIVE],
  },
  {
    path: ROUTES.APPOINTMENT_CREATE_STEP2,
    element: <AppointmentStep2 />,
    roles: [ROLES.ADMINISTRATIVE],
  },

  // =================
  // MEDICAL APPOINTMENT ROUTES
  // =================
  {
    path: ROUTES.MEDICAL_APPOINTMENT,
    element: <MedicalAppointment />,
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.ADMINISTRATIVE],
  },
]);
