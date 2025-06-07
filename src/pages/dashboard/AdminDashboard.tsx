import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  UserGroupIcon,
  Bars3Icon,
  ArrowPathIcon,
  ChartBarIcon,
  UserPlusIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import MetricCard from '@/components/ui/MetricCard';
import UserDropdown from '@/components/ui/UserDropdown';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { ROUTES } from '@/constants';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: 'clinic' | 'green' | 'purple' | 'yellow';
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { stats, loading, error, fetchStats, clearError } = useAdminDashboard();

  const quickActions: QuickAction[] = [
    {
      id: 'manage-patients',
      label: 'Gestión de Pacientes',
      description: 'Ver, crear y editar pacientes',
      icon: <UsersIcon className="h-6 w-6" />,
      route: ROUTES.PATIENTS,
      color: 'clinic',
    },
    {
      id: 'manage-staff',
      label: 'Gestión de Personal',
      description: 'Administrar doctores y personal administrativo',
      icon: <UserGroupIcon className="h-6 w-6" />,
      route: ROUTES.PERSONAL,
      color: 'green',
    },
    {
      id: 'create-patient',
      label: 'Nuevo Paciente',
      description: 'Registrar paciente en el sistema',
      icon: <UserPlusIcon className="h-6 w-6" />,
      route: ROUTES.PATIENT_CREATE,
      color: 'purple',
    },
    {
      id: 'create-doctor',
      label: 'Nuevo Doctor',
      description: 'Registrar doctor en el sistema',
      icon: <UserPlusIcon className="h-6 w-6" />,
      route: ROUTES.DOCTOR_CREATE,
      color: 'yellow',
    },
  ];

  const managementSections = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administración completa de pacientes y personal médico',
      items: [
        {
          name: 'Lista de Pacientes',
          description: 'Ver y gestionar todos los pacientes registrados',
          route: ROUTES.PATIENTS,
          icon: <UsersIcon className="h-5 w-5" />,
          count: 'Ver todos',
        },
        {
          name: 'Personal Médico',
          description: 'Gestionar doctores y personal administrativo',
          route: ROUTES.PERSONAL,
          icon: <UserGroupIcon className="h-5 w-5" />,
          count: 'Ver todos',
        },
      ],
    },
    {
      title: 'Registro Rápido',
      description: 'Acceso directo a formularios de registro',
      items: [
        {
          name: 'Nuevo Paciente',
          description: 'Registrar un nuevo paciente',
          route: ROUTES.PATIENT_CREATE,
          icon: <UserPlusIcon className="h-5 w-5" />,
          count: 'Crear',
        },
        {
          name: 'Nuevo Doctor',
          description: 'Registrar un nuevo doctor',
          route: ROUTES.DOCTOR_CREATE,
          icon: <UserPlusIcon className="h-5 w-5" />,
          count: 'Crear',
        },
        {
          name: 'Nuevo Administrativo',
          description: 'Registrar personal administrativo',
          route: ROUTES.ADMINISTRATIVE_CREATE,
          icon: <UserPlusIcon className="h-5 w-5" />,
          count: 'Crear',
        },
      ],
    },
  ];

  const getColorClasses = (color: QuickAction['color']) => {
    const colorConfig = {
      clinic: {
        bg: 'bg-gradient-to-br from-clinic-500 to-clinic-600 hover:from-clinic-600 hover:to-clinic-700',
        text: 'text-white',
        shadow: 'shadow-clinic-500/25',
      },
      green: {
        bg: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        text: 'text-white',
        shadow: 'shadow-green-500/25',
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
        text: 'text-white',
        shadow: 'shadow-purple-500/25',
      },
      yellow: {
        bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
        text: 'text-white',
        shadow: 'shadow-yellow-500/25',
      },
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
                  <h1 className="text-xl font-bold text-clinic-600">
                    OncoLogic
                  </h1>
                  <p className="text-xs text-gray-500">
                    Panel de Administración
                  </p>
                </div>
              </div>

              <nav className="hidden md:flex space-x-1">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-clinic-600 bg-clinic-50 rounded-lg">
                  <Bars3Icon className="h-4 w-4" />
                  <span>Dashboard Admin</span>
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={fetchStats}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  loading
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:text-clinic-600 hover:bg-gray-100'
                }`}
                title="Actualizar datos"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>

              <UserDropdown />
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
          <p className="text-gray-600 mt-2">
            Panel de administración del sistema OncoLogic
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={clearError} />
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map(action => {
            const colorClasses = getColorClasses(action.color);
            return (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action.route)}
                className={`${colorClasses.bg} ${colorClasses.text} p-6 rounded-xl shadow-lg ${colorClasses.shadow} transition-all duration-200 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-clinic-500 group text-left`}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {action.label}
                    </h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            value={
              loading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="h-6 w-6 animate-spin text-clinic-500" />
                </div>
              ) : (
                stats.totalPatients.toString()
              )
            }
            label="Pacientes Registrados"
            color="clinic"
            icon={<UsersIcon className="h-6 w-6" />}
          />
          <MetricCard
            value={
              loading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="h-6 w-6 animate-spin text-green-500" />
                </div>
              ) : (
                stats.totalPersonal.toString()
              )
            }
            label="Personal Total"
            color="green"
            icon={<UserGroupIcon className="h-6 w-6" />}
          />
          <MetricCard
            value={
              loading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="h-6 w-6 animate-spin text-purple-500" />
                </div>
              ) : (
                stats.totalDoctors.toString()
              )
            }
            label="Doctores"
            color="purple"
            icon={<ChartBarIcon className="h-6 w-6" />}
          />
          <MetricCard
            value={
              loading ? (
                <div className="flex items-center justify-center">
                  <ArrowPathIcon className="h-6 w-6 animate-spin text-yellow-500" />
                </div>
              ) : (
                stats.totalAdministrative.toString()
              )
            }
            label="Administrativos"
            color="yellow"
            icon={<CogIcon className="h-6 w-6" />}
          />
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {managementSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {section.description}
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => navigate(item.route)}
                      className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-clinic-300 hover:bg-clinic-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-clinic-100 transition-colors duration-200">
                          <div className="text-gray-600 group-hover:text-clinic-600">
                            {item.icon}
                          </div>
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900 group-hover:text-clinic-700">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500 group-hover:text-clinic-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-clinic-600 group-hover:text-clinic-700">
                          {item.count}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-clinic-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
