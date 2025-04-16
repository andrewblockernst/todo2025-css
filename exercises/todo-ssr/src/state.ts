// Define tipos para el estado global de la aplicación
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface AppState {
  tasks: Record<string, Task[]>;
  tabs: string[];
  nextId: number;
  activeTab: string;
  filter: "all" | "complete" | "incomplete";
}

// Define las tareas de ejemplo
const example_tasks: Record<string, Task[]> = {
  today: [
    { id: 1, text: "Clean the bar counter", completed: false },
    { id: 2, text: "Restock the fridge", completed: false },
    { id: 3, text: "Sweep the floor", completed: false },
  ],
  kitchen: [
    { id: 4, text: "Wash the dishes", completed: false },
    { id: 5, text: "Clean the stove", completed: false },
    { id: 6, text: "Organize the pantry", completed: false },
  ],
  office: [
    { id: 7, text: "Check inventory", completed: false },
    { id: 8, text: "Prepare weekly report", completed: false },
    { id: 9, text: "Schedule team meeting", completed: false },
  ],
};

// Estado global de la aplicación
export const state: AppState = {
  tasks: { ...example_tasks },
  tabs: ["today", "kitchen", "office"],
  nextId: 10,
  activeTab: "today",
  filter: "all",
};
