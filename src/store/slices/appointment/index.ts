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
  setNotes,
  clearStep2Data,
} = appointmentSlice.actions;

export { asyncActions, step2AsyncActions };
export default appointmentSlice.reducer;
