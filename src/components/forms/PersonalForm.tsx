import React from 'react';
import { Input, Select, Button, Card } from '@/components/ui';
import { 
  DoctorFormData, 
  DoctorEditFormData,
  AdministrativeFormData,
  AdministrativeEditFormData,
  PersonalType,
  SpecialityResponseDTO
} from '@/types/personal';
import { StatusType } from '@/constants';

interface PersonalFormProps {
  formData: DoctorFormData | DoctorEditFormData | AdministrativeFormData | AdministrativeEditFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isEditMode?: boolean;
  personalType: PersonalType;
  specialities?: SpecialityResponseDTO[];
  onFieldChange: (field: string, value: unknown) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const PersonalForm: React.FC<PersonalFormProps> = ({
  formData,
  errors,
  isSubmitting,
  isEditMode = false,
  personalType,
  specialities = [],
  onFieldChange,
  onSubmit,
  onCancel
}) => {
  const statusOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' }
  ];

  const isDoctorForm = personalType === PersonalType.DOCTOR;
  const isAdministrativeForm = personalType === PersonalType.ADMINISTRATIVE;

  // Type guards para acceso seguro a propiedades
  const isDoctorFormData = (data: any): data is DoctorFormData | DoctorEditFormData => {
    return 'medicalLicenseNumber' in data && 'specialityIds' in data;
  };

  const isAdministrativeFormData = (data: any): data is AdministrativeFormData | AdministrativeEditFormData => {
    return 'position' in data && 'department' in data;
  };

  const hasUserFields = (data: any): data is DoctorFormData | AdministrativeFormData => {
    return 'username' in data && 'password' in data && 'confirmPassword' in data;
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      {/* Información de Cuenta - Solo en modo creación */}
      {!isEditMode && hasUserFields(formData) && (
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

      {/* Información Personal */}
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
            placeholder="Número de cédula"
          />

          <Input
            label="Nombres"
            name="name"
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            error={errors.name}
            placeholder="Nombres completos"
          />

          <Input
            label="Apellidos"
            name="lastName"
            type="text"
            required
            value={formData.lastName || ''}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            error={errors.lastName}
            placeholder="Apellidos completos"
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
            label="Fecha de Contratación"
            name="dateOfHiring"
            type="date"
            required
            value={formData.dateOfHiring || ''}
            onChange={(e) => onFieldChange('dateOfHiring', e.target.value)}
            error={errors.dateOfHiring}
          />

          <Select
            label="Estado"
            name="status"
            required
            value={formData.status || 'A'}
            onChange={(e) => onFieldChange('status', e.target.value)}
            error={errors.status}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Información Específica del Doctor */}
      {isDoctorForm && isDoctorFormData(formData) && (
        <Card title="Información Médica">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Número de Licencia Médica"
              name="medicalLicenseNumber"
              type="text"
              required
              value={formData.medicalLicenseNumber}
              onChange={(e) => onFieldChange('medicalLicenseNumber', e.target.value)}
              error={errors.medicalLicenseNumber}
              placeholder="Número de licencia profesional"
            />

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidades
              </label>
              <select
                multiple
                className="input min-h-[120px]"
                value={formData.specialityIds.map(String)}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, option => Number(option.value));
                  onFieldChange('specialityIds', selectedValues);
                }}
              >
                {specialities.map((speciality) => (
                  <option key={speciality.id} value={speciality.id}>
                    {speciality.name}
                  </option>
                ))}
              </select>
              {errors.specialityIds && (
                <p className="mt-1 text-sm text-red-600">{errors.specialityIds}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Mantenga presionado Ctrl (Cmd en Mac) para seleccionar múltiples especialidades
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Información Específica del Administrativo */}
      {isAdministrativeForm && isAdministrativeFormData(formData) && (
        <Card title="Información Administrativa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Cargo"
              name="position"
              type="text"
              required
              value={formData.position}
              onChange={(e) => onFieldChange('position', e.target.value)}
              error={errors.position}
              placeholder="Ej: Secretaria, Recepcionista, Coordinador"
            />

            <Input
              label="Departamento"
              name="department"
              type="text"
              required
              value={formData.department}
              onChange={(e) => onFieldChange('department', e.target.value)}
              error={errors.department}
              placeholder="Ej: Administración, Recepción, Contabilidad"
            />
          </div>
        </Card>
      )}

      {/* Botones de Acción */}
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
          {isEditMode 
            ? `Actualizar ${isDoctorForm ? 'Doctor' : 'Administrativo'}` 
            : `Registrar ${isDoctorForm ? 'Doctor' : 'Administrativo'}`
          }
        </Button>
      </div>
    </form>
  );
};