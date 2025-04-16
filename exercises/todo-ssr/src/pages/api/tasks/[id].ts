import { state } from "../../../state";
import type { Task } from "../../../state";
import type { APIRoute } from "astro";

export const prerender = false;

interface TaskResult {
  task: Task | null;
  tab: string | null;
  index: number;
}

// Encontrar tarea por ID en cualquier pestaña
function findTask(id: number): TaskResult {
  for (const tab in state.tasks) {
    const taskIndex = state.tasks[tab].findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      return { task: state.tasks[tab][taskIndex], tab, index: taskIndex };
    }
  }
  return { task: null, tab: null, index: -1 };
}

interface TaskUpdateRequest {
  text?: string;
  completed?: boolean;
}

export const PUT: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id as string);
  const { task, tab, index } = findTask(id);

  if (!task || tab === null) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = (await request.json()) as TaskUpdateRequest;

  // Actualizar propiedades
  if (data.text !== undefined) task.text = data.text;
  if (data.completed !== undefined) task.completed = data.completed;

  return new Response(JSON.stringify({ task }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = parseInt(params.id as string);
  const { task, tab, index } = findTask(id);

  if (!task || tab === null) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Eliminar tarea
  state.tasks[tab].splice(index, 1);

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
