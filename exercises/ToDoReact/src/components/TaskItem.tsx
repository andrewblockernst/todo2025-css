import React from 'react';
import type { Task } from '../hooks/useTasks';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDeleteTask }) => {
  return (
    <li className="flex items-center p-3 border-b border-amber-700 bg-dark-wood hover:bg-medium-wood transition-colors">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => {
          e.preventDefault(); // Opcional para checkbox
          onToggleComplete(task.id);
        }}
        className="w-5 h-5 mr-3 accent-amber-500"
      />
      <span className={`flex-1 ${task.completed ? 'line-through text-amber-500/70' : 'text-slate-100'}`}>
        {task.text}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onDeleteTask(task.id);
        }}
        className="text-amber-300 hover:text-red-500 transition-colors"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
};

export default TaskItem;