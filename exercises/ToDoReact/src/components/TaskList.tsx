import React from 'react';
import TaskItem from './TaskItem';
import type { Task } from '../hooks/useTasks';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
    <div className="p-8 text-center text-amber-200 bg-amber-950">
      No tasks to display. Add a new task!
    </div>
    );
  }

  return (
    <ul className="space-y-2 mb-6 overflow-y-auto max-h-64 bg-amber-950">
      {tasks.map(task => (
        <li
          key={task.id}
          className="flex justify-between items-center p-3 bg-amber-950 rounded-lg task-item"
          data-task-id={task.id}
        >
          <span className={`text-lg ${task.completed ? 'text-amber-300 line-through' : 'text-slate-100'}`}>
            {task.text}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onDeleteTask(task.id)}
              className="bg-red-900 hover:bg-red-600 text-slate-100 hover:text-amber-950 p-2 rounded border border-red-600 transition-colors"
              aria-label="Eliminar tarea"
            >
              🛢️
            </button>
            <button
              onClick={() => onToggleComplete(task.id)}
              className="bg-green-900 hover:bg-green-600 text-slate-100 hover:text-amber-950 p-2 rounded border border-green-400 transition-colors"
              aria-label="Completar tarea"
            >
              {task.completed ? '✅' : '🍺'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;