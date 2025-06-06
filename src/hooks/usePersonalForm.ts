import { useState } from 'react';
import { 
  DoctorFormData, 
  DoctorEditFormData,
  AdministrativeFormData,
  AdministrativeEditFormData,
  DoctorDTO,
  AdministrativeDTO,
  PersonalType
} from '@/types/personal';

const isDoctorCreateData = (data: unknown): data is DoctorFormData => {
  return typeof data === 'object' && data !== null &&
    'medicalLicenseNumber' in data &&
    'specialityIds' in data &&
    'username' in data &&
    'password' in data;
};

const isDoctorEditData = (data: unknown): data is DoctorEditFormData => {
  return typeof data === 'object' && data !== null &&
    'medicalLicenseNumber' in data &&
    'specialityIds' in data &&
    'id' in data &&
    !('username' in data);
};

const isAdministrativeCreateData = (data: unknown): data is AdministrativeFormData => {
  return typeof data === 'object' && data !== null &&
    'position' in data &&
    'department' in data &&
    'username' in data &&
    'password' in data;
};

const isAdministrativeEditData = (data: unknown): data is AdministrativeEditFormData => {
  return typeof data === 'object' && data !== null &&
    'position' in data &&
    'department' in data &&
    'id' in data &&
    !('username' in data);
};

const hasUserCredentials = (data: unknown): data is (DoctorFormData | AdministrativeFormData) => {
  return typeof data === 'object' && data !== null &&
    'username' in data &&
    'password' in data &&
    'confirmPassword' in data;
};

interface UseDoctorCreateFormProps {
  mode: 'create';
  type: PersonalType.DOCTOR;
  onSubmit: (data: DoctorDTO) => Promise<void>;
  initialData?: Partial<DoctorFormData>;
}

interface UseDoctorEditFormProps {
  mode: 'edit';
  type: PersonalType.DOCTOR;
  onSubmit: (data: Partial<DoctorDTO>) => Promise<void>;
  initialData?: DoctorEditFormData;
}

interface UseAdministrativeCreateFormProps {
  mode: 'create';
  type: PersonalType.ADMINISTRATIVE;
  onSubmit: (data: AdministrativeDTO) => Promise<void>;
  initialData?: Partial<AdministrativeFormData>;
}

interface UseAdministrativeEditFormProps {
  mode: 'edit';
  type: PersonalType.ADMINISTRATIVE;
  onSubmit: (data: Partial<AdministrativeDTO>) => Promise<void>;
  initialData?: AdministrativeEditFormData;
}

type UsePersonalFormProps = 
  | UseDoctorCreateFormProps 
  | UseDoctorEditFormProps 
  | UseAdministrativeCreateFormProps 
  | UseAdministrativeEditFormProps;

export const usePersonalForm = (props: UsePersonalFormProps) => {
  // Establecer datos iniciales
  const getDefaultFormData = () => {
    const baseDefaults = {
      idNumber: '',
      name: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfHiring: new Date().toISOString().split('T')[0],
      status: 'A' as const,
      availabilityIds: []
    };

    if (props.mode === 'create') {
      const createDefaults = {
        ...baseDefaults,
        username: '',
        password: '',
        confirmPassword: '',
        roleIds: props.type === PersonalType.DOCTOR ? [2] : [3], // DOCTOR=2, ADMINISTRATIVE=3
        ...props.initialData
      };

      if (props.type === PersonalType.DOCTOR) {
        return {
          ...createDefaults,
          medicalLicenseNumber: '',
          specialityIds: []
        };
      } else {
        return {
          ...createDefaults,
          position: '',
          department: ''
        };
      }
    } else {
      if (props.type === PersonalType.DOCTOR) {
        return props.initialData || {
          ...baseDefaults,
          id: 0,
          medicalLicenseNumber: '',
          specialityIds: []
        };
      } else {
        return props.initialData || {
          ...baseDefaults,
          id: 0,
          position: '',
          department: ''
        };
      }
    }
  };

  const [formData, setFormData] = useState(getDefaultFormData());
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

    if (!formData.idNumber?.trim()) newErrors.idNumber = 'El número de identificación es obligatorio';
    if (!formData.name?.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.lastName?.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email?.trim()) newErrors.email = 'El email es obligatorio';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'El teléfono es obligatorio';
    if (!formData.dateOfHiring) newErrors.dateOfHiring = 'La fecha de contratación es obligatoria';

    if (hasUserCredentials(formData)) {
      if (!formData.username?.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
      if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (isDoctorCreateData(formData) || isDoctorEditData(formData)) {
      if (!formData.medicalLicenseNumber?.trim()) {
        newErrors.medicalLicenseNumber = 'El número de licencia médica es obligatorio';
      }
    }

    if (isAdministrativeCreateData(formData) || isAdministrativeEditData(formData)) {
      if (!formData.position?.trim()) newErrors.position = 'El cargo es obligatorio';
      if (!formData.department?.trim()) newErrors.department = 'El departamento es obligatorio';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (formData.dateOfHiring) {
      const hireDate = new Date(formData.dateOfHiring);
      const today = new Date();
      if (hireDate > today) {
        newErrors.dateOfHiring = 'La fecha de contratación no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (props.mode === 'create') {
        if (isDoctorCreateData(formData)) {
          const { 
            username, 
            password,  
            roleIds, 
            medicalLicenseNumber, 
            specialityIds, 
            ...personalFields 
          } = formData;
          
          const submitData: DoctorDTO = {
            personalData: {
              userData: {
                username,
                password,
                roleIds
              },
              ...personalFields
            },
            medicalLicenseNumber,
            specialityIds
          };

          console.log('Enviando DoctorDTO:', JSON.stringify(submitData, null, 2));
          await (props as UseDoctorCreateFormProps).onSubmit(submitData);
          
        } else if (isAdministrativeCreateData(formData)) {
          const { 
            username, 
            password, 
            roleIds, 
            position, 
            department, 
            ...personalFields 
          } = formData;
          
          const submitData: AdministrativeDTO = {
            personalData: {
              userData: {
                username,
                password,
                roleIds
              },
              ...personalFields
            },
            position,
            department
          };

          console.log('Enviando AdministrativeDTO:', JSON.stringify(submitData, null, 2));
          await (props as UseAdministrativeCreateFormProps).onSubmit(submitData);
        }
      } else {
        if (isDoctorEditData(formData)) {
          const { ...updateData } = formData;
          await (props as UseDoctorEditFormProps).onSubmit(updateData);
          
        } else if (isAdministrativeEditData(formData)) {
          const { ...updateData } = formData;
          await (props as UseAdministrativeEditFormProps).onSubmit(updateData);
        }
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      throw error;
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
    isCreateMode: props.mode === 'create',
    isEditMode: props.mode === 'edit',
    personalType: props.type
  };
};