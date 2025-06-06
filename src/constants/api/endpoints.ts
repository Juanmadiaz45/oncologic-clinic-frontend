// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',

  // Users
  USERS: '/users',
  USERS_PAGINATED: '/users/paginated',
  USERS_SEARCH: '/users/search',

  // Patients
  PATIENTS: '/users/patients',

  // Doctors
  DOCTORS: '/doctors',

  // Administrative
  ADMINISTRATIVE: '/administrative',

  // Specialities
  SPECIALITIES: '/specialities',

  // Appointments
  MEDICAL_APPOINTMENTS: '/medical-appointments',
  APPOINTMENT_TYPES: '/medical-appointment-types',
  MEDICAL_OFFICES: '/medical-offices',
  MEDICAL_TASKS: '/medical-tasks',

  // Medical History
  MEDICAL_HISTORY: '/patients/medical-history',

  // Observations
  OBSERVATIONS: '/observations',

  // Treatments
  TREATMENTS: '/treatments',
  TREATMENT_TYPES: '/type-of-treatments',

  // Prescribed Medicines
  PRESCRIBED_MEDICINES: '/prescribed-medicines',

  // Appointment Results
  APPOINTMENT_RESULTS: '/appointment-results',

  // Laboratory
  LABORATORIES: '/laboratories',
  MEDICAL_EXAMINATIONS: '/medical-examinations',
  EXAMINATION_RESULTS: '/examination-results',
  EXAM_TYPES: '/types-of-exam',

  // Availability
  AVAILABILITIES: '/availabilities',
  STATUSES: '/statuses',

  // Roles and Permissions
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
} as const;
