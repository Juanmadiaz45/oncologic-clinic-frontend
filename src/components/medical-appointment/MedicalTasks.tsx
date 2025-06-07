import React from 'react';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { MedicalTask } from '@/types/appointments/medicalAppointmentTypesPage';

interface MedicalTasksProps {
  tasks: MedicalTask[];
  onTaskToggle: (taskId: number, completed: boolean) => void;
  completedCount: number;
  totalCount: number;
}

const MedicalTasks: React.FC<MedicalTasksProps> = ({
  tasks,
  onTaskToggle,
  completedCount,
  totalCount
}) => {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tareas Médicas</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{completedCount} de {totalCount} completadas</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-clinic-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-400">No hay tareas asignadas</p>
            <p className="text-sm text-gray-400 mt-1">Las tareas aparecerán aquí cuando sean asignadas</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center space-x-4 p-6 transition-all duration-200 ${
                task.completed 
                  ? 'bg-green-50 hover:bg-green-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <button
                onClick={() => onTaskToggle(task.id, !task.completed)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  task.completed
                    ? 'bg-clinic-500 border-clinic-500 hover:bg-clinic-600'
                    : 'border-gray-300 hover:border-clinic-400 hover:bg-clinic-50'
                }`}
              >
                {task.completed && (
                  <CheckCircleIcon className="h-4 w-4 text-white" />
                )}
              </button>

              <div className="flex-1">
                <div className={`font-medium transition-all duration-200 ${
                  task.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }`}>
                  {task.description}
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  {task.estimatedTime && (
                    <div className={`text-sm flex items-center space-x-1 ${
                      task.completed ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <ClockIcon className="h-3 w-3" />
                      <span>{task.estimatedTime}</span>
                    </div>
                  )}
                  {task.responsible && (
                    <div className={`text-sm ${
                      task.completed ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Responsable: {task.responsible}
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                task.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.completed ? 'Completada' : 'Pendiente'}
              </div>
            </div>
          ))
        )}
      </div>

      {totalCount > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progreso total</span>
            <span className="font-medium text-gray-900">
              {Math.round(progressPercentage)}% completado
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalTasks;