// src/store/slices/appointment/index.ts
import appointmentSlice from './slice';
import * as asyncActions from './actions';

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
} = appointmentSlice.actions;

export { asyncActions };
export default appointmentSlice.reducer;
