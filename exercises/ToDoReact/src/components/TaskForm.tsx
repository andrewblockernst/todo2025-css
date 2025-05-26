import React, { useState, useEffect } from "react";
import { useAddTask, useUpdateTask } from "../hooks/useTasks";
import { useClientStore } from "../store/clientStore";
import { Beer } from "lucide-react";

const TaskForm: React.FC = () => {
  const [text, setText] = useState("");
  const { activeTab, editingTask, setEditingTask } = useClientStore();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();

  const isEditing = !!editingTask;

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
    } else {
      setText("");
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (isEditing) {
      updateTaskMutation.mutate(
        { id: editingTask.id, text: text.trim() },
        {
          onSuccess: () => {
            setEditingTask(null);
            setText("");
          },
        }
      );
    } else {
      addTaskMutation.mutate(
        { text: text.trim(), tab: activeTab },
        {
          onSuccess: () => setText(""),
        }
      );
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setText("");
  };

  const isLoading = addTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 bg-dark-wood">
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center">
          <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isEditing ? "Editar tarea..." : "Enter a new task..."}
        className="bg-amber-200 flex-grow p-2 rounded-md focus:outline-none"
        autoComplete="off"
        disabled={isLoading}
          />
          <div className="mx-2" />
          <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="bg-green-700 hover:bg-green-500 text-slate-100 font-bold py-2 px-3 rounded-md transition-colors"
          >
        {isLoading ? "..." : isEditing ? "Apply changes" : <Beer className="inline-block w-5 h-5 mb-0.5" />}
          </button>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-2 rounded transition-colors"
            >
              Cancel changes
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
