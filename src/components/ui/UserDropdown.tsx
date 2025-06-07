import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

interface UserDropdownProps {
  userAvatar?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, userRoles, username } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleViewProfile = () => {
    setIsOpen(false);
    // TODO: Add navigation to profile page when implemented
    console.log('Ver perfil - functionality not implemented yet');
  };

  // Get username initials for default avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user role display text
  const getUserRoleDisplay = () => {
    if (userRoles.includes('ADMIN')) return 'Administrador';
    if (userRoles.includes('DOCTOR')) return 'Doctor';
    if (userRoles.includes('ADMINISTRATIVE')) return 'Administrativo';
    if (userRoles.includes('PATIENT')) return 'Paciente';
    return 'Usuario';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 text-gray-700 hover:text-clinic-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:ring-offset-2 rounded-lg px-3 py-2"
      >
        {/* Avatar */}
        <div className="relative">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={username || 'Usuario'}
              className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-8 w-8 bg-clinic-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {getInitials(username || 'Usuario')}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        {/* Username */}
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-gray-900">
            {username || 'Usuario'}
          </div>
          <div className="text-xs text-gray-500">En línea</div>
        </div>

        {/* Chevron */}
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-dropdown border border-gray-200 py-1 z-50 animate-slide-down">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={username || 'Usuario'}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-clinic-500 rounded-full flex items-center justify-center text-white font-medium">
                  {getInitials(username || 'Usuario')}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {username || 'Usuario'}
                </div>
                <div className="text-xs text-gray-500">
                  {getUserRoleDisplay()}
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={handleViewProfile}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-clinic-600 transition-colors duration-200"
            >
              <UserCircleIcon className="h-4 w-4 mr-3" />
              Ver Perfil
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
