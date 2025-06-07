// src/hooks/useAppointments.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { asyncActions } from '@/store/slices/appointment'; // Import asynchronous actions
import {
  selectPatient,
  selectAppointmentType,
  updateFormData,
  addMedicalTask,
  removeMedicalTask,
  nextStep,
  previousStep,
  resetForm,
  setError,
  clearSearchResults,
  clearValidationErrors,
} from '@/store/slices/appointment';
import { AppointmentFormData } from '@/store/slices/appointment/types/formData';
import { MedicalTask, Patient } from '@/types';

export const useAppointments = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const {
    formData,
    currentStep,
    isSearchingPatients,
    isLoadingTypes,
    isCalculatingDuration,
    isSaving,
    searchResults,
    appointmentTypes,
    baseAppointments,
    error,
    validationErrors,
  } = useAppSelector(state => state.appointment);

  // Actions
  const actions = {
    // Patient search (now uses asyncActions)
    searchPatients: useCallback(
      (idNumber: string) => {
        dispatch(asyncActions.searchPatients(idNumber));
      },
      [dispatch]
    ),

    // Load appointment types (now uses async Actions)
    loadAppointmentTypes: useCallback(() => {
      dispatch(asyncActions.loadAppointmentTypes());
    }, [dispatch]),

    // Calculate duration (now uses asyncActions)
    calculateDuration: useCallback(
      (typeId: number) => {
        if (baseAppointments.length > 0) {
          dispatch(
            asyncActions.calculateDuration({ typeId, baseAppointments })
          );
        }
      },
      [dispatch, baseAppointments]
    ),

    // Save appointment (now uses asyncActions)
    saveAppointment: useCallback(
      (appointmentData: unknown) => {
        dispatch(asyncActions.saveAppointment(appointmentData));
      },
      [dispatch]
    ),

    // Synchronous actions remain the same
    selectPatient: useCallback(
      (patient: Patient) => {
        dispatch(selectPatient(patient));
      },
      [dispatch]
    ),

    selectAppointmentType: useCallback(
      (typeId: number) => {
        dispatch(selectAppointmentType(typeId));
      },
      [dispatch]
    ),

    updateFormData: useCallback(
      (data: AppointmentFormData) => {
        dispatch(updateFormData(data));
      },
      [dispatch]
    ),

    nextStep: useCallback(() => {
      dispatch(nextStep());
    }, [dispatch]),

    previousStep: useCallback(() => {
      dispatch(previousStep());
    }, [dispatch]),

    addMedicalTask: useCallback(
      (task: MedicalTask) => {
        dispatch(addMedicalTask(task));
      },
      [dispatch]
    ),

    removeMedicalTask: useCallback(
      (taskId: number) => {
        dispatch(removeMedicalTask(taskId));
      },
      [dispatch]
    ),

    resetForm: useCallback(() => {
      dispatch(resetForm());
    }, [dispatch]),

    clearSearchResults: useCallback(() => {
      dispatch(clearSearchResults());
    }, [dispatch]),

    setError: useCallback(
      (error: string | null) => {
        dispatch(setError(error));
      },
      [dispatch]
    ),

    clearValidationErrors: useCallback(() => {
      dispatch(clearValidationErrors());
    }, [dispatch]),
  };

  // Computed values (stays the same)
  const computed = {
    isFormValid: formData.patient && formData.appointmentTypeId,
    canGoNext:
      currentStep === 1 ? formData.patient && formData.appointmentTypeId : true,
    canGoPrevious: currentStep > 1,
    totalDuration: formData.duration,
    isLoading:
      isSearchingPatients ||
      isLoadingTypes ||
      isCalculatingDuration ||
      isSaving,
  };

  return {
    // State (stays the same)
    formData,
    currentStep,
    searchResults,
    appointmentTypes,
    error,
    validationErrors,

    // Loading states (stays the same)
    isSearchingPatients,
    isLoadingTypes,
    isCalculatingDuration,
    isSaving,

    // Actions (updated)
    ...actions,

    // Computed (stays the same)
    ...computed,
  };
};
