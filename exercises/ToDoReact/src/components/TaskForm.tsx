import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (text: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Esto evita la recarga de página
    
    if (text.trim()) {
      onAddTask(text);
      setText('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full p-4 bg-dark-wood"
    >
      <div className="flex w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          autoComplete="off"
        />
        <button 
          type="submit"
          className="bg-medium-wood hover:bg-amber-700 text-slate-100 font-bold py-2 px-4 rounded-r-md transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default TaskForm;