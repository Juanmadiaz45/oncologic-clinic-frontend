import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { DoctorResponseDTO, AdministrativeResponseDTO } from '@/types/personal';

type PersonalWithType = (DoctorResponseDTO | AdministrativeResponseDTO) & { type: 'DOCTOR' | 'ADMINISTRATIVE' };

interface PersonalTableProps {
  personal: PersonalWithType[];
  loading: boolean;
  deletingId: number | null;
  onEdit: (person: PersonalWithType) => void;
  onView: (person: PersonalWithType) => void;
  onDelete: (person: PersonalWithType) => void;
}

export const PersonalTable: React.FC<PersonalTableProps> = ({
  personal,
  loading,
  deletingId,
  onEdit,
  onView,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'DOCTOR' | 'ADMINISTRATIVE'>('ALL');
  const [sortField, setSortField] = useState<'name' | 'lastName' | 'email'>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredPersonal = personal.filter(person => {
    const matchesSearch = 
      person.personalData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.personalData.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.personalData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.personalData.phoneNumber.includes(searchTerm) ||
      person.personalData.idNumber.includes(searchTerm);

    const matchesType = filterType === 'ALL' || person.type === filterType;

    return matchesSearch && matchesType;
  });

  const sortedPersonal = [...filteredPersonal].sort((a, b) => {
    const aValue = a.personalData[sortField];
    const bValue = b.personalData[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleSort = (field: 'name' | 'lastName' | 'email') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatStatus = (status: string) => {
    return status === 'A' ? 'Activo' : 'Inactivo';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const getPersonalInfo = (person: PersonalWithType) => {
    if (person.type === 'DOCTOR') {
      const doctor = person as DoctorResponseDTO;
      return {
        title: 'Dr.',
        specific: `Lic. ${doctor.medicalLicenseNumber}`,
        badge: 'Doctor'
      };
    } else {
      const admin = person as AdministrativeResponseDTO;
      return {
        title: '',
        specific: `${admin.position} - ${admin.department}`,
        badge: 'Administrativo'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando personal...</span>
        </div>
      </div>
    );
  }

  if (personal.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay personal registrado</h3>
        <p className="mt-1 text-sm text-gray-500">Comience registrando el primer miembro del personal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por nombre, email, teléfono o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={filterType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterType(e.target.value as 'ALL' | 'DOCTOR' | 'ADMINISTRATIVE')
            }
          >
            <option value="ALL">Todos</option>
            <option value="DOCTOR">Doctores</option>
            <option value="ADMINISTRATIVE">Administrativos</option>
          </select>
          
          <div className="text-sm text-gray-500">
            {filteredPersonal.length} de {personal.length} persona{personal.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table with displacement */}
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nombre</span>
                    {sortField === 'lastName' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Información Específica
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Contratación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPersonal.map((person) => {
                const info = getPersonalInfo(person);
                return (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {person.personalData.name[0]}{person.personalData.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {info.title} {person.personalData.name} {person.personalData.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {person.personalData.idNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        person.type === 'DOCTOR' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {info.badge}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {info.specific}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{person.personalData.email}</div>
                        <div className="text-gray-500">{person.personalData.phoneNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        person.personalData.status === 'A' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {formatStatus(person.personalData.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(person.personalData.dateOfHiring)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className={`flex ${person.type === 'DOCTOR' ? 'space-x-2' : 'space-x-2 justify-end'}`}>
                            {person.type === 'DOCTOR' && (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onView(person)}
                                className="text-indigo-600 hover:text-indigo-900"
                            >
                                Ver
                            </Button>
                            )}
                            <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onEdit(person)}
                            className="text-white"
                            >
                            Editar
                            </Button>
                            <Button
                            size="sm"
                            variant="error"
                            onClick={() => onDelete(person)}
                            disabled={deletingId === person.id}
                            isLoading={deletingId === person.id}
                            className="text-white"
                            >
                            {deletingId === person.id ? 'Eliminando...' : 'Eliminar'}
                            </Button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};