import { PayloadAction } from '@reduxjs/toolkit';
import { AppointmentState } from '../types/state';
import { DoctorResponseDTO, TimeSlot } from '@/types';

export const step2Reducers = {
  // Doctor selection
  setDoctorSearchTerm: (
    state: AppointmentState,
    action: PayloadAction<string>
  ) => {
    state.formData.step2.doctorSearchTerm = action.payload;
  },

  selectDoctor: (
    state: AppointmentState,
    action: PayloadAction<DoctorResponseDTO>
  ) => {
    state.formData.step2.selectedDoctor = action.payload;
    // Reset dependent selections
    state.formData.step2.selectedDate = null;
    state.formData.step2.selectedTimeSlot = null;
    state.formData.step2.availableTimeSlots = [];
    state.formData.step2.selectedOfficeId = null;
    state.formData.step2.availableOffices = [];
  },

  setSelectedSpeciality: (
    state: AppointmentState,
    action: PayloadAction<number | null>
  ) => {
    state.formData.step2.selectedSpecialityId = action.payload;
    // Clear doctor selection when speciality changes
    state.formData.step2.selectedDoctor = null;
    state.formData.step2.availableDoctors = [];
  },

  // Date and time selection
  setSelectedDate: (state: AppointmentState, action: PayloadAction<string>) => {
    state.formData.step2.selectedDate = action.payload;
    // Reset time and office selections
    state.formData.step2.selectedTimeSlot = null;
    state.formData.step2.selectedOfficeId = null;
    state.formData.step2.availableOffices = [];
  },

  selectTimeSlot: (
    state: AppointmentState,
    action: PayloadAction<TimeSlot>
  ) => {
    state.formData.step2.selectedTimeSlot = action.payload;
    // Reset office selection
    state.formData.step2.selectedOfficeId = null;
    state.formData.step2.availableOffices = [];
  },

  // Office selection
  setSelectedOffice: (
    state: AppointmentState,
    action: PayloadAction<number>
  ) => {
    state.formData.step2.selectedOfficeId = action.payload;
  },

  // Clear step 2 data
  clearStep2Data: (state: AppointmentState) => {
    state.formData.step2 = {
      selectedDoctor: null,
      availableDoctors: [],
      doctorSearchTerm: '',
      selectedSpecialityId: null,
      selectedDate: null,
      selectedTimeSlot: null,
      availableTimeSlots: [],
      doctorAvailabilities: [],
      selectedOfficeId: null,
      availableOffices: [],
    };
  },
  clearAvailableDoctors: (state: AppointmentState) => {
    state.formData.step2.availableDoctors = [];
  },
};
