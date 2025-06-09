import React, { useState } from 'react';
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { MedicalTask, CreateMedicalTaskRequest } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui';

interface TasksListProps {
  tasks: MedicalTask[];
  customTasks: CreateMedicalTaskRequest[];
  selectedTypeId: number | null;
  totalDuration: number;
  onAddCustomTask: (task: CreateMedicalTaskRequest) => void;
  onRemoveCustomTask: (index: number) => void;
  onUpdateCustomTask: (index: number, task: CreateMedicalTaskRequest) => void;
}

interface NewTaskForm {
  description: string;
  estimatedTime: number;
  responsible: string;
}

export const TasksList: React.FC<TasksListProps> = ({
  tasks,
  customTasks,
  selectedTypeId,
  totalDuration,
  onAddCustomTask,
  onRemoveCustomTask,
  onUpdateCustomTask,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskForm>({
    description: '',
    estimatedTime: 15,
    responsible: 'Doctor',
  });
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<NewTaskForm>({
    description: '',
    estimatedTime: 15,
    responsible: 'Doctor',
  });

  const handleAddTask = () => {
    if (!newTask.description.trim()) return;

    const taskToAdd: CreateMedicalTaskRequest = {
      description: newTask.description,
      estimatedTime: newTask.estimatedTime,
      status: 'PENDIENTE',
      responsible: newTask.responsible,
    };

    onAddCustomTask(taskToAdd);
    setNewTask({ description: '', estimatedTime: 15, responsible: 'Doctor' });
    setIsAddingTask(false);
  };

  const handleEditTask = (index: number) => {
    const task = customTasks[index];
    setEditTask({
      description: task.description,
      estimatedTime: task.estimatedTime,
      responsible: task.responsible,
    });
    setEditingTaskIndex(index);
  };

  const handleUpdateTask = () => {
    if (editingTaskIndex === null || !editTask.description.trim()) return;

    const updatedTask: CreateMedicalTaskRequest = {
      description: editTask.description,
      estimatedTime: editTask.estimatedTime,
      status: 'PENDIENTE',
      responsible: editTask.responsible,
    };

    onUpdateCustomTask(editingTaskIndex, updatedTask);
    setEditingTaskIndex(null);
    setEditTask({ description: '', estimatedTime: 15, responsible: 'Doctor' });
  };

  const handleCancelEdit = () => {
    setEditingTaskIndex(null);
    setEditTask({ description: '', estimatedTime: 15, responsible: 'Doctor' });
  };

  const handleCancelAdd = () => {
    setIsAddingTask(false);
    setNewTask({ description: '', estimatedTime: 15, responsible: 'Doctor' });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-700">
          Tareas médicas asociadas
        </h3>
      </div>

      {tasks.length === 0 && customTasks.length === 0 ? (
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
          {/* Appointment type template tasks */}
          {tasks.length > 0 && (
            <>
              <div className="text-sm font-medium text-gray-600 mb-2">
                Tareas del tipo de cita ({tasks.length})
              </div>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {task.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      Responsable: {task.responsible} • Estado: {task.status}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    {task.estimatedTime} min
                  </div>
                </div>
              ))}
            </>
          )}
          {selectedTypeId && (
            <div className="flex items-center justify-end mt-4">
              <button
                onClick={() => setIsAddingTask(true)}
                className="flex items-center space-x-2 text-sm text-clinic-600 hover:text-clinic-700 font-medium transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Agregar tarea médica</span>
              </button>
            </div>
          )}
          {/* Custom tasks */}
          {customTasks.length > 0 && (
            <>
              <div className="text-sm font-medium text-gray-600 mb-2 mt-4">
                Tareas personalizadas ({customTasks.length})
              </div>
              {customTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  {editingTaskIndex === index ? (
                    <div className="flex-1 space-y-3">
                      <Input
                        value={editTask.description}
                        onChange={e =>
                          setEditTask(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Descripción de la tarea"
                      />
                      <div className="flex space-x-3">
                        <Input
                          type="number"
                          value={editTask.estimatedTime.toString()}
                          onChange={e =>
                            setEditTask(prev => ({
                              ...prev,
                              estimatedTime: parseInt(e.target.value) || 15,
                            }))
                          }
                          placeholder="Tiempo (min)"
                          min="1"
                          className="w-24"
                        />
                        <Input
                          value={editTask.responsible}
                          onChange={e =>
                            setEditTask(prev => ({
                              ...prev,
                              responsible: e.target.value,
                            }))
                          }
                          placeholder="Responsable"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleUpdateTask}>
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleCancelEdit}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {task.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          Responsable: {task.responsible} • Estado:{' '}
                          {task.status}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-green-600">
                          {task.estimatedTime} min
                        </div>
                        <button
                          onClick={() => handleEditTask(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => onRemoveCustomTask(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
          {/* Form to add a new task */}
          {isAddingTask && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-3">
                <Textarea
                  label="Descripción de la tarea"
                  value={newTask.description}
                  onChange={e =>
                    setNewTask(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describa la tarea médica..."
                  rows={2}
                />
                <div className="flex space-x-3">
                  <Input
                    label="Tiempo estimado (min)"
                    type="number"
                    value={newTask.estimatedTime.toString()}
                    onChange={e =>
                      setNewTask(prev => ({
                        ...prev,
                        estimatedTime: parseInt(e.target.value) || 15,
                      }))
                    }
                    min="1"
                    className="w-32"
                  />
                  <Input
                    label="Responsable"
                    value={newTask.responsible}
                    onChange={e =>
                      setNewTask(prev => ({
                        ...prev,
                        responsible: e.target.value,
                      }))
                    }
                    placeholder="Doctor, Enfermera, etc."
                    className="flex-1"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    onClick={handleAddTask}
                    disabled={!newTask.description.trim()}
                  >
                    Agregar Tarea
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCancelAdd}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
