// src/pages/dashboard/AdministrativeDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  Bars3Icon,
  ArrowPathIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import MetricCard from '@/components/ui/MetricCard';
import UserDropdown from '@/components/ui/UserDropdown';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: 'clinic' | 'green' | 'purple' | 'yellow';
}

const AdministrativeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Get current date info
  const today = new Date();
  const currentDate = today.getDate().toString();
  const currentDay = today.toLocaleDateString('es-ES', { weekday: 'long' });
  const currentMonth = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const currentTime = today.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const quickActions: QuickAction[] = [
    {
      id: 'register-patient',
      label: 'Registrar Paciente',
      description: 'Agregar nuevo paciente al sistema',
      icon: <UserPlusIcon className="h-6 w-6" />,
      route: ROUTES.PATIENT_CREATE,
      color: 'clinic'
    },
    {
      id: 'view-patients',
      label: 'Lista de Pacientes',
      description: 'Ver todos los pacientes registrados',
      icon: <UsersIcon className="h-6 w-6" />,
      route: ROUTES.PATIENTS,
      color: 'green'
    },
    {
      id: 'schedule-appointment',
      label: 'Agendar Cita Médica',
      description: 'Programar nueva cita médica',
      icon: <CalendarDaysIcon className="h-6 w-6" />,
      route: ROUTES.APPOINTMENT_CREATE_STEP1,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: QuickAction['color']) => {
    const colorConfig = {
      clinic: {
        bg: 'bg-gradient-to-br from-clinic-500 to-clinic-600 hover:from-clinic-600 hover:to-clinic-700',
        text: 'text-white',
        shadow: 'shadow-clinic-500/25'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        text: 'text-white',
        shadow: 'shadow-green-500/25'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
        text: 'text-white',
        shadow: 'shadow-purple-500/25'
      },
      yellow: {
        bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
        text: 'text-white',
        shadow: 'shadow-yellow-500/25'
      }
    };
    return colorConfig[color];
  };

  const handleQuickActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-clinic-500 rounded-lg flex items-center justify-center">
                  <img
                    src="/pharmacy.png"
                    alt="OncoLogic"
                    className="h-7 w-7 filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-clinic-600">OncoLogic</h1>
                  <p className="text-xs text-gray-500">Panel Administrativo</p>
                </div>
              </div>
              
              <nav className="hidden md:flex space-x-1">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-clinic-600 bg-clinic-50 rounded-lg">
                  <Bars3Icon className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <ClockIcon className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
              
              <UserDropdown username={currentUser?.username || 'Administrativo'} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {currentUser?.username}!
          </h2>
          <p className="text-gray-600 mt-2">Gestione los pacientes y citas médicas de la clínica</p>
        </div>

        {/* Date and Time Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Date Card */}
          <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-clinic-600 mb-2">
              {currentDate}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {currentDay}
            </div>
            <div className="text-xs text-clinic-500 font-medium mt-1">
              {currentMonth}
            </div>
          </div>

          {/* Current Time Card */}
          <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {currentTime}
            </div>
            <div className="text-sm text-gray-600">
              Hora actual
            </div>
            <div className="text-xs text-green-500 font-medium mt-1">
              Colombia
            </div>
          </div>

          {/* Office Info Card */}
          <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600 mb-1">
              Clínica OncoLogic
            </div>
            <div className="text-sm text-gray-600">
              Sistema activo
            </div>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map(action => {
            const colorClasses = getColorClasses(action.color);
            return (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action.route)}
                className={`${colorClasses.bg} ${colorClasses.text} p-8 rounded-xl shadow-lg ${colorClasses.shadow} transition-all duration-200 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clinic-500 group text-left h-full`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-200">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{action.label}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            value="Hoy"
            label="Sesión de trabajo"
            color="clinic"
            icon={<CalendarDaysIcon className="h-6 w-6" />}
          />
          <MetricCard
            value="Activo"
            label="Estado del sistema"
            color="green"
            icon={<ArrowPathIcon className="h-6 w-6" />}
          />
          <MetricCard
            value="Disponible"
            label="Portal de registro"
            color="purple"
            icon={<UserPlusIcon className="h-6 w-6" />}
          />
        </div>

        {/* Information Panel */}
        <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Accesos Rápidos</h3>
            <p className="text-sm text-gray-600 mt-1">Funciones principales del sistema administrativo</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Patient Management */}
              <div className="bg-clinic-50 rounded-lg p-4 border border-clinic-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-clinic-100 rounded-lg">
                    <UsersIcon className="h-5 w-5 text-clinic-600" />
                  </div>
                  <h4 className="font-medium text-clinic-900">Gestión de Pacientes</h4>
                </div>
                <p className="text-sm text-clinic-700 mb-3">
                  Registre nuevos pacientes y consulte la información de pacientes existentes.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(ROUTES.PATIENT_CREATE)}
                    className="text-xs bg-clinic-600 text-white px-3 py-1 rounded hover:bg-clinic-700 transition-colors"
                  >
                    Registrar
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.PATIENTS)}
                    className="text-xs bg-white text-clinic-600 border border-clinic-600 px-3 py-1 rounded hover:bg-clinic-50 transition-colors"
                  >
                    Ver Lista
                  </button>
                </div>
              </div>

              {/* Appointment Scheduling */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-purple-900">Citas Médicas</h4>
                </div>
                <p className="text-sm text-purple-700 mb-3">
                  Programe citas médicas para los pacientes con los doctores disponibles.
                </p>
                <button
                  onClick={() => navigate(ROUTES.APPOINTMENT_CREATE_STEP1)}
                  className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
                >
                  Agendar Cita
                </button>
              </div>

              {/* System Info */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-medium text-green-900">Sistema OncoLogic</h4>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Plataforma de gestión integral para clínicas oncológicas.
                </p>
                <div className="text-xs text-green-600 font-medium">
                  ✓ Sistema operativo
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdministrativeDashboard;
