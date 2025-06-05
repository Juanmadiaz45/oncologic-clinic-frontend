import React from 'react';
import { PendingTask } from '@/types/dashboard';

interface PendingTasksProps {
  tasks: PendingTask[];
  onTaskToggle: (taskId: number, completed: boolean) => void;
}

const PendingTasks: React.FC<PendingTasksProps> = ({ tasks, onTaskToggle }) => {
  const getTaskTypeColor = (type: PendingTask['type']) => {
    const typeConfig = {
      BIOPSY: 'text-red-600',
      PROTOCOL: 'text-yellow-600',
      FOLLOW_UP: 'text-blue-600',
      CALL: 'text-green-600'
    };
    return typeConfig[type] || 'text-gray-600';
  };

  const getPriorityIcon = (priority: PendingTask['priority']) => {
    switch (priority) {
      case 'HIGH':
        return <span className="text-red-500">●</span>;
      case 'MEDIUM':
        return <span className="text-yellow-500">●</span>;
      case 'LOW':
        return <span className="text-green-500">●</span>;
      default:
        return <span className="text-gray-500">●</span>;
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas Pendientes</h3>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No hay tareas pendientes</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                task.completed 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => onTaskToggle(task.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              
              <div className="flex items-center space-x-2">
                {getPriorityIcon(task.priority)}
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.description}
                  </div>
                  <div className={`text-xs ${
                    task.completed ? 'text-gray-400' : getTaskTypeColor(task.type)
                  }`}>
                    {task.patientName}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingTasks;