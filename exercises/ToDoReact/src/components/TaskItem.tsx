import React, { useRef } from "react";
import { useUpdateTask, useDeleteTask, type Task } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";
import { SquarePen, Trash, } from "lucide-react";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { setEditingTask } = useClientStore();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleToggleComplete = () => {
    updateTaskMutation.mutate({
      id: task.id,
      completed: !task.completed,
    });
  };

  const handleEdit = () => {
    setEditingTask({ id: task.id, text: task.text });
  };

  const handleDelete = () => {
    dialogRef.current?.showModal();
  };

  const confirmDelete = () => {
    deleteTaskMutation.mutate(task.id);
    dialogRef.current?.close();
  };

  const cancelDelete = () => {
    dialogRef.current?.close();
  };

  // Cerrar dialog al hacer clic fuera (en el backdrop)
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
    }
  };

  // Cerrar dialog con tecla Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      dialogRef.current?.close();
    }
  };

  const isLoading =
    updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <>
      <li className="flex items-center justify-between p-3 border-b border-amber-700 bg-dark-wood hover:bg-medium-wood transition-colors">
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isLoading}
            className="w-5 h-5 mr-3 accent-amber-500"
          />
          <span
            className={`flex-1 ${
              task.completed ? "line-through text-amber-500" : "text-slate-100"
            }`}
          >
            {task.text}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            disabled={isLoading}
            className="text-amber-300 hover:text-blue-400 transition-colors disabled:opacity-50"
            aria-label="Edit task"
          >
            <SquarePen className='h-5 w-5 mt-0.5'/>
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-amber-300 hover:text-red-400 transition-colors disabled:opacity-50"
            aria-label="Delete task"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </li>

      {/* Dialog HTML nativo con estilo pub irlandés */}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onKeyDown={handleKeyDown}
        className="irish-pub-dialog backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="bg-orange-950 border-4 border-amber-300 rounded-lg p-6 max-w-md shadow-2xl">
          {/* Header decorativo */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-amber-800/30 px-4 py-2 rounded-full border border-amber-400">
              <span className="text-2xl">🍺</span>
              <h2 className="text-lg font-bold text-amber-200">hey mate!</h2>
          
            </div>
          </div>

          {/* Contenido */}
          <div className="text-center mb-6">
            <p className="text-amber-100 mb-2">
              Sure you want to delete this task?
            </p>
            <div className="bg-amber-900/50 p-3 rounded border border-amber-600">
              <p className="text-amber-200 font-medium italic">"{task.text}"</p>
            </div>
            <p className="text-amber-300 text-sm mt-2">
              This action cannot be undone. Please confirm.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-700 border-2 border-amber-400 text-amber-100 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteTaskMutation.isPending}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 border-2 border-red-400 text-red-100 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>

          {/* Footer decorativo */}
          <div className="mt-4 text-center">
            <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full opacity-60"></div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TaskItem;
