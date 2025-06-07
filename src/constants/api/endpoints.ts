// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  
  // Users
  USERS: '/api/users',
  USERS_PAGINATED: '/api/users/paginated',
  USERS_SEARCH: '/api/users/search',
  
  // Patients
  PATIENTS: '/api/users/patients',
  
  // Doctors
  DOCTORS: '/api/doctors',
  
  // Administrative
  ADMINISTRATIVE: '/api/administrative',
  
  // Specialities
  SPECIALITIES: '/api/specialities',
  
  // Medical Appointments
  MEDICAL_APPOINTMENTS: '/api/medical-appointments',
  APPOINTMENT_TYPES: '/api/medical-appointment-types',
  MEDICAL_OFFICES: '/api/medical-offices',
  MEDICAL_TASKS: '/api/medical-tasks',
  
  // Medical History
  MEDICAL_HISTORY: '/api/patients/medical-history',
  
  // Observations
  OBSERVATIONS: '/api/observations',
  
  // Treatments
  TREATMENTS: '/api/treatments',
  TREATMENT_TYPES: '/api/type-of-treatments',
  
  // Prescribed Medicines
  PRESCRIBED_MEDICINES: '/api/prescribed-medicines',
  
  // Appointment Results
  APPOINTMENT_RESULTS: '/api/appointment-results',
  
  // Laboratory
  LABORATORIES: '/api/laboratories',
  MEDICAL_EXAMINATIONS: '/api/medical-examinations',
  EXAMINATION_RESULTS: '/api/examination-results',
  EXAM_TYPES: '/api/types-of-exam',
  
  // Availability
  AVAILABILITIES: '/api/availabilities',
  STATUSES: '/api/statuses',
  
  // Roles and Permissions
  ROLES: '/api/roles',
  PERMISSIONS: '/api/permissions',
  
  // Dashboard
  DOCTOR_DASHBOARD: '/api/doctor-dashboard'
} as const;