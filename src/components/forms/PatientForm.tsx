import React from 'react';
import { Input, Select, Textarea, Button, Card } from '@/components/ui';
import { PatientFormData, PatientEditFormData } from '@/types/patients/extended';

interface PatientFormProps {
  formData: PatientFormData | PatientEditFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isEditMode?: boolean;
  onFieldChange: (field: string, value: unknown) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

// Type guard helper
const isPatientFormData = (data: PatientFormData | PatientEditFormData): data is PatientFormData => {
  return 'username' in data && 'password' in data && 'confirmPassword' in data && 'currentHealthStatus' in data;
};

export const PatientForm: React.FC<PatientFormProps> = ({
  formData,
  errors,
  isSubmitting,
  isEditMode = false,
  onFieldChange,
  onSubmit,
  onCancel
}) => {
  const genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' }
  ];

  // const getFieldValue = (field: keyof PatientFormData): string => {
  //   return (formData as any)[field] || '';
  // };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      {/* Account Information - Create mode only */}
      {!isEditMode && isPatientFormData(formData) && (
        <Card title="Información de Cuenta">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre de Usuario"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => onFieldChange('username', e.target.value)}
              error={errors.username}
              placeholder="Ingrese nombre de usuario único"
            />
            
            <Input
              label="Contraseña"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => onFieldChange('password', e.target.value)}
              error={errors.password}
              placeholder="Mínimo 8 caracteres"
            />

            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="Repita la contraseña"
            />
          </div>
        </Card>
      )}

      {/* Personal Information */}
      <Card title="Información Personal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Número de Identificación"
            name="idNumber"
            type="text"
            required
            value={formData.idNumber || ''}
            onChange={(e) => onFieldChange('idNumber', e.target.value)}
            error={errors.idNumber}
            placeholder="Número de cédula o identificación"
          />
          
          <Input
            label="Nombre Completo"
            name="name"
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            error={errors.name}
            placeholder="Nombres y apellidos completos"
          />

          <Input
            label="Fecha de Nacimiento"
            name="birthDate"
            type="date"
            required
            value={formData.birthDate || ''}
            onChange={(e) => onFieldChange('birthDate', e.target.value)}
            error={errors.birthDate}
          />

          <Select
            label="Género"
            name="gender"
            required
            value={formData.gender || 'M'}
            onChange={(e) => onFieldChange('gender', e.target.value)}
            error={errors.gender}
            options={genderOptions}
          />

          <Input
            label="Teléfono"
            name="phoneNumber"
            type="tel"
            required
            value={formData.phoneNumber || ''}
            onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
            error={errors.phoneNumber}
            placeholder="+57 300 123 4567"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={formData.email || ''}
            onChange={(e) => onFieldChange('email', e.target.value)}
            error={errors.email}
            placeholder="correo@ejemplo.com"
          />

          <div className="md:col-span-2">
            <Input
              label="Dirección"
              name="address"
              type="text"
              required
              value={formData.address || ''}
              onChange={(e) => onFieldChange('address', e.target.value)}
              error={errors.address}
              placeholder="Dirección completa de residencia"
            />
          </div>
        </div>
      </Card>

      {/* Health Status - Only in creation mode */}
      {!isEditMode && isPatientFormData(formData) && (
        <Card title="Información Médica Inicial">
          <Textarea
            label="Estado de Salud Actual"
            name="currentHealthStatus"
            required
            value={formData.currentHealthStatus}
            onChange={(e) => onFieldChange('currentHealthStatus', e.target.value)}
            error={errors.currentHealthStatus}
            placeholder="Describa el estado de salud actual del paciente, síntomas principales, diagnósticos previos, etc."
            rows={4}
          />
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditMode ? 'Actualizar Paciente' : 'Registrar Paciente'}
        </Button>
      </div>
    </form>
  );
};