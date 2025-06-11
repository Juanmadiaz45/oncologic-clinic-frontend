import React from 'react';
import { Button, Input, Select } from '@/components/ui';
import { Laboratory, TypeOfExam, CreateMedicalExaminationRequest } from '@/types/examinations';

interface ExaminationFormProps {
  initialData?: Partial<CreateMedicalExaminationRequest>;
  laboratories: Laboratory[];
  typeOfExams: TypeOfExam[];
  loading?: boolean;
  onSubmit: (data: CreateMedicalExaminationRequest) => Promise<void>;
  onCancel: () => void;
}

export const ExaminationForm: React.FC<ExaminationFormProps> = ({
  initialData,
  laboratories,
  typeOfExams,
  loading = false,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = React.useState<CreateMedicalExaminationRequest>({
    dateOfRealization: initialData?.dateOfRealization || new Date().toISOString().split('T')[0],
    laboratoryId: initialData?.laboratoryId || 0,
    typeOfExamId: initialData?.typeOfExamId || 0
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.dateOfRealization) {
      newErrors.dateOfRealization = 'La fecha es requerida';
    }

    if (!formData.laboratoryId || formData.laboratoryId === 0) {
      newErrors.laboratoryId = 'El laboratorio es requerido';
    }

    if (!formData.typeOfExamId || formData.typeOfExamId === 0) {
      newErrors.typeOfExamId = 'El tipo de examen es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = <K extends keyof CreateMedicalExaminationRequest>(
    field: K,
    value: CreateMedicalExaminationRequest[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const laboratoryOptions = laboratories.map(lab => ({
    value: lab.id,
    label: `${lab.name} - ${lab.location}`
  }));

  const typeOfExamOptions = typeOfExams.map(type => ({
    value: type.id,
    label: type.name
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Fecha de Realización"
          type="date"
          value={formData.dateOfRealization}
          onChange={(e) => handleInputChange('dateOfRealization', e.target.value)}
          error={errors.dateOfRealization}
          required
          min={new Date().toISOString().split('T')[0]}
        />

        <Select
          label="Laboratorio"
          value={formData.laboratoryId.toString()}
          onChange={(e) => handleInputChange('laboratoryId', parseInt(e.target.value))}
          options={laboratoryOptions}
          error={errors.laboratoryId}
          required
        />

        <Select
          label="Tipo de Examen"
          value={formData.typeOfExamId.toString()}
          onChange={(e) => handleInputChange('typeOfExamId', parseInt(e.target.value))}
          options={typeOfExamOptions}
          error={errors.typeOfExamId}
          required
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={loading}
        >
          Crear Examen Médico
        </Button>
      </div>
    </form>
  );
};