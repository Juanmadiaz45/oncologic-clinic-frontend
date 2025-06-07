import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const useAppointmentSteps = (currentStep: number, isValid: boolean) => {
  const navigate = useNavigate();

  const nextStep = () => {
    if (!isValid) return;
    navigate(`${ROUTES.APPOINTMENT_CREATE_STEP2}${currentStep + 1}`);
  };

  const prevStep = () => {
    navigate(`${ROUTES.APPOINTMENT_CREATE_STEP1}${currentStep - 1}`);
  };

  return { nextStep, prevStep };
};
