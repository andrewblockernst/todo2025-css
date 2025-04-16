import { state } from "../../state";
import type { Task } from "../../state";
import type { APIRoute } from "astro";

export const prerender = false;

interface TaskRequest {
  text: string;
  tab?: string;
}

export const GET: APIRoute = async ({ url }) => {
  const params = new URL(url).searchParams;
  const tab = params.get("tab") || state.activeTab;
  const filter = params.get("filter") || state.filter;

  let tasks = state.tasks[tab] || [];

  // Aplicar filtros
  if (filter === "complete") {
    tasks = tasks.filter((task) => task.completed);
  } else if (filter === "incomplete") {
    tasks = tasks.filter((task) => !task.completed);
  }

  return new Response(JSON.stringify({ tasks }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = (await request.json()) as TaskRequest;
  const { text, tab = state.activeTab } = data;

  if (!text || text.trim() === "") {
    return new Response(JSON.stringify({ error: "Task text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Crear nueva tarea
  if (!state.tasks[tab]) state.tasks[tab] = [];

  const newTask: Task = {
    id: state.nextId++,
    text: text.trim(),
    completed: false,
  };

  state.tasks[tab].push(newTask);

  return new Response(JSON.stringify({ task: newTask }), {
    headers: { "Content-Type": "application/json" },
  });
};
