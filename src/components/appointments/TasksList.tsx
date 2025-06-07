import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { MedicalTask } from '@/types';

interface TasksListProps {
  tasks: MedicalTask[];
  selectedTypeId: number | null;
  totalDuration: number;
}

export const TasksList: React.FC<TasksListProps> = ({
  tasks,
  selectedTypeId,
  totalDuration,
}) => {
  const handleAddTask = () => {
    // TODO: Implement add task functionality
    console.log('Add task functionality not implemented yet');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-700">
          Tareas médicas asociadas
        </h3>
        {selectedTypeId && (
          <button
            onClick={handleAddTask}
            className="flex items-center space-x-2 text-sm text-clinic-600 hover:text-clinic-700 font-medium transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Agregar tarea médica</span>
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            {selectedTypeId
              ? 'No hay tareas asociadas a este tipo de cita'
              : 'Seleccione un tipo de cita para ver las tareas médicas'}
          </div>
          {totalDuration > 0 && (
            <div className="text-sm text-gray-500">
              Duración estimada total: {totalDuration} minutos
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {task.description}
                </div>
                <div className="text-sm text-gray-500">
                  Responsable: {task.responsible} • Estado: {task.status}
                </div>
              </div>
              <div className="text-sm font-medium text-clinic-600">
                {task.estimatedTime} min
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
