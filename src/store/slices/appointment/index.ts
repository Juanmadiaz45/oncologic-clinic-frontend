import appointmentSlice from './slice';
import * as asyncActions from './actions';
import * as step2AsyncActions from './actions/step2Actions';

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  updateFormData,
  selectPatient,
  selectAppointmentType,
  clearSearchResults,
  addMedicalTask,
  removeMedicalTask,
  addCustomMedicalTask,
  removeCustomMedicalTask,
  updateCustomMedicalTask,
  resetForm,
  setError,
  setValidationErrors,
  clearValidationErrors,

  // Step 2 actions
  setDoctorSearchTerm,
  selectDoctor,
  setSelectedSpeciality,
  setSelectedDate,
  selectTimeSlot,
  setSelectedOffice,
  clearStep2Data,
  clearAvailableDoctors, // New action to clear available doctors
} = appointmentSlice.actions;

export { asyncActions, step2AsyncActions };
export default appointmentSlice.reducer;
