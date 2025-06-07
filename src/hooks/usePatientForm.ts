import { useState } from 'react';
import { 
  PatientFormData, 
  PatientEditFormData, 
  CreatePatientRequest, 
  UpdatePatientRequest
} from '@/types/patients/extended';

// Mode-specific interfaces
interface UsePatientCreateFormProps {
  mode: 'create';
  onSubmit: (data: CreatePatientRequest) => Promise<void>;
  initialData?: Partial<PatientFormData>;
}

interface UsePatientEditFormProps {
  mode: 'edit';
  onSubmit: (data: UpdatePatientRequest) => Promise<void>;
  initialData?: PatientEditFormData;
}

type UsePatientFormProps = UsePatientCreateFormProps | UsePatientEditFormProps;

// Type guards
const isCreateMode = (props: UsePatientFormProps): props is UsePatientCreateFormProps => {
  return props.mode === 'create';
};

const isEditMode = (props: UsePatientFormProps): props is UsePatientEditFormProps => {
  return props.mode === 'edit';
};

const isPatientFormData = (data: PatientFormData | PatientEditFormData): data is PatientFormData => {
  return 'username' in data && 'password' in data && 'confirmPassword' in data && 'currentHealthStatus' in data;
};

export const usePatientForm = (props: UsePatientFormProps) => {
  // Set initial data with default values
  const getDefaultFormData = (): PatientFormData | PatientEditFormData => {
    if (isCreateMode(props)) {
      return {
        idNumber: '',
        name: '',
        birthDate: '',
        gender: 'M' as const,
        address: '',
        phoneNumber: '',
        email: '',
        currentHealthStatus: '',
        username: '',
        password: '',
        confirmPassword: '',
        roleIds: [4], // Default PATIENT role
        ...props.initialData
      };
    } else {
      return props.initialData || {
        id: 0,
        idNumber: '',
        name: '',
        birthDate: '',
        gender: 'M' as const,
        address: '',
        phoneNumber: '',
        email: ''
      };
    }
  };

  const [formData, setFormData] = useState<PatientFormData | PatientEditFormData>(
    getDefaultFormData()
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validations (fields that always exist)
    if (!formData.idNumber?.trim()) newErrors.idNumber = 'El número de identificación es obligatorio';
    if (!formData.name?.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    if (!formData.address?.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'El teléfono es obligatorio';
    if (!formData.email?.trim()) newErrors.email = 'El email es obligatorio';

    // Specific validations for creation
    if (isCreateMode(props) && isPatientFormData(formData)) {
      if (!formData.username?.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
      if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
      if (!formData.currentHealthStatus?.trim()) newErrors.currentHealthStatus = 'El estado de salud es obligatorio';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Validation of date of birth
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate = 'La fecha de nacimiento no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isCreateMode(props) && isPatientFormData(formData)) {
        // Creation mode
        const { username, password, roleIds, ...patientData } = formData;
        const submitData: CreatePatientRequest = {
          ...patientData,
          userData: {
            username,
            password,
            roleIds
          }
        };
        await props.onSubmit(submitData);
      } else if (isEditMode(props)) {
        // Edit mode
        const { ...patientData } = formData as PatientEditFormData;
        const submitData: UpdatePatientRequest = patientData;
        await props.onSubmit(submitData);
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      throw error; // Re-throw so the page can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    validateForm,
    isCreateMode: isCreateMode(props),
    isEditMode: isEditMode(props)
  };
};