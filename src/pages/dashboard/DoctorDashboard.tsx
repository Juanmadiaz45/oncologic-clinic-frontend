import React from 'react';
import { 
  CalendarDaysIcon, 
  ArrowPathIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import MetricCard from '@/components/ui/MetricCard';
import UserDropdown from '@/components/ui/UserDropdown';
import TodayAppointments from '@/components/dashboard/TodayAppointments';
import NextAppointment from '@/components/dashboard/NextAppointment';
import QuickActions from '@/components/dashboard/QuickActions';
import { useDashboard } from '@/hooks/useDashboard';
import authService from '@/services/auth/authService';

const DoctorDashboard: React.FC = () => {
  const { dashboardData, isLoading, error, refreshData } = useDashboard();
  const currentUser = authService.getCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto h-12 w-12 text-clinic-500 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const errorBanner = error && (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="text-yellow-600 text-sm">
          ⚠️ {error}
        </div>
        <button
          onClick={refreshData}
          className="ml-auto text-yellow-700 hover:text-yellow-800 text-sm underline"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!dashboardData) return null;

  const { metrics, todayAppointments, nextAppointment } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <p className="text-xs text-gray-500">Sistema de Gestión Clínica</p>
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
              <button
                onClick={refreshData}
                className="p-2 text-gray-400 hover:text-clinic-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Actualizar datos"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              
              <UserDropdown username={currentUser?.username || 'Doctor'} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorBanner}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, Dr. {currentUser?.username}!
          </h2>
          <p className="text-gray-600 mt-1">Aquí tiene un resumen de su jornada</p>
        </div>

        {/* Layout principal con alturas iguales */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-8 items-start">
          {/* Columna izquierda: 3 cards apiladas */}
          <div className="space-y-6">
            {/* Card 1: Citas de hoy */}
            <MetricCard
              value={metrics.appointmentsToday}
              label="Citas de hoy"
              color="clinic"
              icon={<CalendarDaysIcon className="h-6 w-6" />}
            />
            
            {/* Card 2: Fecha */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-clinic-600 mb-1">
                {metrics.currentDate}
              </div>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('es-ES', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="text-xs text-clinic-500 font-medium mt-1">
                {metrics.currentDay}
              </div>
            </div>

            {/* Card 3: Acciones rápidas */}
            <QuickActions />
          </div>

          {/* Columna derecha: Próxima cita con altura completa */}
          <div className="h-full">
            <div className="h-full">
              <NextAppointment nextAppointment={nextAppointment} />
            </div>
          </div>
        </div>

        {/* Sección de citas de hoy */}
        <div className="mb-6">
          <TodayAppointments appointments={todayAppointments} />
        </div>

        {/* Estadísticas del día */}
        <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Estadísticas del Día</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-8 text-center max-w-md">
              <div>
                <div className="text-2xl font-bold text-clinic-600">
                  {todayAppointments.filter(a => a.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-600">Completadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {todayAppointments.filter(a => a.status === 'IN_PROGRESS').length}
                </div>
                <div className="text-sm text-gray-600">En progreso</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {todayAppointments.filter(a => a.status === 'SCHEDULED').length}
                </div>
                <div className="text-sm text-gray-600">Programadas</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;