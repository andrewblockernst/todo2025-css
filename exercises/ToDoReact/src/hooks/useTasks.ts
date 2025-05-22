import { useState, useCallback } from 'react';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface TasksState {
  [key: string]: Task[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function useTasks() {
  const [tasks, setTasks] = useState<TasksState>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (tab: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/tasks?tab=${tab}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      
      setTasks(prev => ({
        ...prev,
        [tab]: data.tasks || []
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (text: string, tabName: string) => {
    if (!text.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tab: tabName })
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      
      setTasks(prev => ({
        ...prev,
        [tabName]: [...(prev[tabName] || []), data.task]
      }));
    } catch (err) {
      console.error('Error al añadir tarea:', err);
      setError(err instanceof Error ? err.message : 'Error al añadir tarea');
    }
  }, []);

  const toggleComplete = useCallback(async (id: number, tabName: string) => {
    try {
      // Primero encontramos la tarea para saber su estado actual
      const task = tasks[tabName]?.find(t => t.id === id);
      if (!task) return;
      
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      
      setTasks(prev => ({
        ...prev,
        [tabName]: prev[tabName].map(t => 
          t.id === id ? data.task : t
        )
      }));
    } catch (err) {
      console.error('Error al cambiar estado de tarea:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar tarea');
    }
  }, [tasks]);  // Incluimos tasks como dependencia porque lo usamos dentro

  const deleteTask = useCallback(async (id: number, tabName: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      setTasks(prev => ({
        ...prev,
        [tabName]: prev[tabName].filter(task => task.id !== id)
      }));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar tarea');
    }
  }, []);

  const clearCompleted = useCallback(async (tabName: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab: tabName })
      });
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      // Actualiza el estado local
      setTasks(prev => ({
        ...prev,
        [tabName]: prev[tabName].filter(task => !task.completed)
      }));
    } catch (err) {
      console.error('Error al limpiar tareas completadas:', err);
      setError(err instanceof Error ? err.message : 'Error al limpiar tareas');
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleComplete,
    deleteTask,
    clearCompleted
  };
}