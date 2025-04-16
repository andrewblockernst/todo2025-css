import { state } from "../../../state";
import type { APIRoute } from "astro";

export const prerender = false;

interface ClearTasksRequest {
  tab?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const data = (await request.json()) as ClearTasksRequest;
  const { tab = state.activeTab } = data;

  if (!state.tasks[tab]) {
    return new Response(JSON.stringify({ error: "Tab not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Filtrar tareas completadas
  const initialCount = state.tasks[tab].length;
  state.tasks[tab] = state.tasks[tab].filter((task) => !task.completed);
  const removed = initialCount - state.tasks[tab].length;

  return new Response(
    JSON.stringify({
      success: true,
      removed,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
