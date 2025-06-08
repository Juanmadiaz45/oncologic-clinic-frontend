import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const useAppointmentSteps = (
  currentStep: number,
  isValid: boolean = true
) => {
  const navigate = useNavigate();

  const nextStep = () => {
    if (!isValid) return;

    if (currentStep === 1) {
      navigate(ROUTES.APPOINTMENT_CREATE_STEP2);
    } else if (currentStep === 2) {
      // After step 2, we could go to a confirmation screen or dashboard
      navigate(ROUTES.DASHBOARD);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      navigate(ROUTES.APPOINTMENT_CREATE_STEP1);
    } else if (currentStep === 1) {
      // From step 1, return to the previous dashboard or screen
      navigate(ROUTES.DASHBOARD);
    }
  };

  const goToStep = (step: number) => {
    if (step === 1) {
      navigate(ROUTES.APPOINTMENT_CREATE_STEP1);
    } else if (step === 2) {
      navigate(ROUTES.APPOINTMENT_CREATE_STEP2);
    }
  };

  const cancel = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return {
    nextStep,
    prevStep,
    goToStep,
    cancel,
    canGoNext: isValid,
    canGoPrev: true,
  };
};
