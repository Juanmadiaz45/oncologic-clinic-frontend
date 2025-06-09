import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSpecialities } from '@/hooks/usePersonal';
import * as step2Actions from '@/store/slices/appointment/actions/step2Actions';
import {
  setDoctorSearchTerm,
  selectDoctor,
  setSelectedSpeciality,
  setSelectedDate,
  selectTimeSlot,
  setSelectedOffice,
  setError,
} from '@/store/slices/appointment';
import { DoctorResponseDTO, TimeSlot, CreateAppointmentRequest } from '@/types';

export const useAppointmentStep2 = () => {
  const dispatch = useAppDispatch();
  const { specialities } = useSpecialities();

  // Selectors
  const {
    formData,
    isSearchingDoctors,
    isLoadingDoctors,
    isLoadingTimeSlots,
    isLoadingOffices,
    isCreatingAppointment,
    error,
  } = useAppSelector(state => state.appointment);

  const step2Data = formData.step2;

  // Actions
  const searchDoctors = useCallback(
    (searchTerm: string) => {
      dispatch(setDoctorSearchTerm(searchTerm));
      if (searchTerm.trim()) {
        dispatch(step2Actions.searchDoctors(searchTerm));
      }
    },
    [dispatch]
  );

  const getDoctorsBySpeciality = useCallback(
    (specialityId: number) => {
      dispatch(setSelectedSpeciality(specialityId));
      dispatch(step2Actions.getDoctorsBySpeciality(specialityId));
    },
    [dispatch]
  );

  const handleSelectDoctor = useCallback(
    async (doctor: DoctorResponseDTO) => {
      dispatch(selectDoctor(doctor));
      // Load doctor availabilities
      await dispatch(
        step2Actions.getPersonalAvailabilities(doctor.personalData.id)
      );
    },
    [dispatch]
  );

  const handleSetSelectedDate = useCallback(
    async (date: string) => {
      dispatch(setSelectedDate(date));

      if (
        step2Data.selectedDoctor &&
        step2Data.doctorAvailabilities.length > 0
      ) {
        // Generate time slots for the selected date
        await dispatch(
          step2Actions.generateTimeSlots({
            date,
            duration: formData.duration,
            availabilities: step2Data.doctorAvailabilities,
          })
        );
      }
    },
    [
      dispatch,
      step2Data.selectedDoctor,
      step2Data.doctorAvailabilities,
      formData.duration,
    ]
  );

  const handleSelectTimeSlot = useCallback(
    async (timeSlot: TimeSlot) => {
      dispatch(selectTimeSlot(timeSlot));

      if (step2Data.selectedDate) {
        // Get available offices for the selected time slot
        await dispatch(
          step2Actions.getAvailableOffices({
            date: step2Data.selectedDate,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
          })
        );
      }
    },
    [dispatch, step2Data.selectedDate]
  );

  const handleSetSelectedOffice = useCallback(
    (officeId: number) => {
      dispatch(setSelectedOffice(officeId));
    },
    [dispatch]
  );

  const handleCreateAppointment = useCallback(async () => {
    const isFormValid = !!(
      step2Data.selectedDoctor &&
      step2Data.selectedDate &&
      step2Data.selectedTimeSlot &&
      step2Data.selectedOfficeId
    );

    if (!isFormValid || isCreatingAppointment) return;

    const appointmentData: CreateAppointmentRequest = {
      doctorId: step2Data.selectedDoctor!.id,
      typeOfMedicalAppointmentId: formData.appointmentTypeId!,
      appointmentDate: `${step2Data.selectedDate}T${
        step2Data.selectedTimeSlot!.startTime
      }:00`,
      medicalHistoryId: formData.patient!.medicalHistory.id!,
      medicalOfficeId: step2Data.selectedOfficeId!,
      medicalTaskIds: [],
    };

    await dispatch(step2Actions.createAppointment(appointmentData));
  }, [dispatch, step2Data, formData, isCreatingAppointment]);

  const handleSetError = useCallback(
    (error: string | null) => {
      dispatch(setError(error));
    },
    [dispatch]
  );

  // Computed properties
  const isFormValid = !!(
    step2Data.selectedDoctor &&
    step2Data.selectedDate &&
    step2Data.selectedTimeSlot &&
    step2Data.selectedOfficeId
  );

  const canCreateAppointment = isFormValid && !isCreatingAppointment;

  return {
    // Form data
    formData,
    step2Data,
    specialities,

    // Loading states
    isSearchingDoctors,
    isLoadingDoctors,
    isLoadingTimeSlots,
    isLoadingOffices,
    isCreatingAppointment,
    error,

    // Actions
    searchDoctors,
    getDoctorsBySpeciality,
    selectDoctor: handleSelectDoctor,
    setSelectedDate: handleSetSelectedDate,
    selectTimeSlot: handleSelectTimeSlot,
    setSelectedOffice: handleSetSelectedOffice,
    createAppointment: handleCreateAppointment,
    setError: handleSetError,

    // Computed
    isFormValid,
    canCreateAppointment,
  };
};
