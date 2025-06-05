import React from 'react';
import { 
  CalendarDaysIcon, 
  UsersIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import MetricCard from '@/components/ui/MetricCard';
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
          <ArrowPathIcon className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-2 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="btn btn-primary"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { metrics, todayAppointments, nextAppointment } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/pharmacy.png"
                  alt="OncoLogic"
                  className="h-8 w-8"
                />
                <h1 className="text-xl font-semibold text-blue-600">OncoLogic</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser?.username || 'Doctor'}
              </span>
              <button
                onClick={authService.logout}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            value={metrics.appointmentsToday}
            label="Citas Hoy"
            color="blue"
            icon={<CalendarDaysIcon className="h-6 w-6" />}
          />
          <MetricCard
            value={metrics.activePatients}
            label="Pacientes"
            color="green"
            icon={<UsersIcon className="h-6 w-6" />}
          />
        </div>

        {/* Fecha actual */}
        <div className="text-right mb-6">
          <div className="text-3xl font-bold text-blue-600">
            {metrics.currentDate}
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}<br />
            {metrics.currentDay}
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Citas de hoy */}
          <div className="lg:col-span-2">
            <TodayAppointments appointments={todayAppointments} />
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Próxima cita */}
            <NextAppointment nextAppointment={nextAppointment} />

            {/* Acciones rápidas */}
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;