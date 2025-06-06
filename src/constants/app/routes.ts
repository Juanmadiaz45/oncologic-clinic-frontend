// Routes
export const ROUTES = {
  CALENDAR: '/calendar',
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',

  // Create Appointment
  APPOINTMENT_CREATE_STEP1: '/appointments/create/step1',
  APPOINTMENT_CREATE_STEP2: '/appointments/create/step2',

  // Patients
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/:id',
  PATIENT_CREATE: '/patients/create',
  PATIENT_EDIT: '/patients/:id/edit',

  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAIL: '/appointments/:id',
  APPOINTMENT_CREATE: '/appointments/create',
  APPOINTMENT_EDIT: '/appointments/:id/edit',

  // Staff
  PERSONAL: '/staff/personal',
  
  DOCTORS: '/staff/doctors',
  DOCTOR_DETAIL: '/staff/doctors/:id',
  DOCTOR_CREATE: '/staff/doctors/create',
  DOCTOR_EDIT: '/staff/doctors/:id/edit',

  ADMINISTRATIVE: '/staff/administrative',
  ADMINISTRATIVE_DETAIL: '/staff/administrative/:id',
  ADMINISTRATIVE_CREATE: '/staff/administrative/create',
  ADMINISTRATIVE_EDIT: '/staff/administrative/:id/edit',

  SPECIALITIES: '/staff/specialities',
  SPECIALITY_DETAIL: '/staff/specialities/:id',
  SPECIALITY_CREATE: '/staff/specialities/create',
  SPECIALITY_EDIT: '/staff/specialities/:id/edit',

  // Laboratory
  EXAMINATIONS: '/laboratory/examinations',
  EXAMINATION_DETAIL: '/laboratory/examinations/:id',
  EXAMINATION_CREATE: '/laboratory/examinations/create',
  EXAMINATION_EDIT: '/laboratory/examinations/:id/edit',

  RESULTS: '/laboratory/results',
  RESULT_DETAIL: '/laboratory/results/:id',
  RESULT_CREATE: '/laboratory/results/create',
  RESULT_EDIT: '/laboratory/results/:id/edit',

  // Administration
  USERS: '/administration/users',
  USER_DETAIL: '/administration/users/:id',
  USER_CREATE: '/administration/users/create',
  USER_EDIT: '/administration/users/:id/edit',

  ROLES_MGMT: '/administration/roles',
  ROLE_DETAIL: '/administration/roles/:id',
  ROLE_CREATE: '/administration/roles/create',
  ROLE_EDIT: '/administration/roles/:id/edit',
} as const;
