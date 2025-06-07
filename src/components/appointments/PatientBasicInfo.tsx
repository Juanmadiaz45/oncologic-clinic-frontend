import React from 'react';
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Patient } from '@/types';

interface PatientBasicInfoProps {
  patient: Patient;
}

export const PatientBasicInfo: React.FC<PatientBasicInfoProps> = ({
  patient,
}) => {
  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatGender = (gender: string): string => {
    const genderMap: Record<string, string> = {
      M: 'Masculino',
      F: 'Femenino',
      O: 'Otro',
    };
    return genderMap[gender] || gender;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-base font-medium text-gray-700 mb-4 flex items-center space-x-2">
        <UserIcon className="h-5 w-5 text-clinic-500" />
        <span>Información básica del paciente</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient Name */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Nombre completo
          </div>
          <div className="mt-1 text-sm font-medium text-gray-900">
            {patient.name}
          </div>
        </div>

        {/* Age and Birth Date */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Edad
          </div>
          <div className="mt-1 text-sm text-gray-900 flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span>
              {calculateAge(patient.birthDate)} años (
              {formatDate(patient.birthDate)})
            </span>
          </div>
        </div>

        {/* Gender */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Género
          </div>
          <div className="mt-1 text-sm text-gray-900">
            {formatGender(patient.gender)}
          </div>
        </div>

        {/* ID Number */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Cédula
          </div>
          <div className="mt-1 text-sm text-gray-900">{patient.idNumber}</div>
        </div>

        {/* Phone */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Teléfono
          </div>
          <div className="mt-1 text-sm text-gray-900 flex items-center space-x-2">
            <PhoneIcon className="h-4 w-4 text-gray-400" />
            <span>{patient.phoneNumber}</span>
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Email
          </div>
          <div className="mt-1 text-sm text-gray-900 flex items-center space-x-2">
            <EnvelopeIcon className="h-4 w-4 text-gray-400" />
            <span>{patient.email}</span>
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Dirección
          </div>
          <div className="mt-1 text-sm text-gray-900">{patient.address}</div>
        </div>

        {/* Medical History Status */}
        {patient.medicalHistory && (
          <div className="md:col-span-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Estado de salud actual
            </div>
            <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
              {patient.medicalHistory.currentHealthStatus}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
