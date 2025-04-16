import { state } from "../../state";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      filter: state.filter,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

interface FilterRequest {
  filter: "all" | "complete" | "incomplete";
}

export const PUT: APIRoute = async ({ request }) => {
  const data = (await request.json()) as FilterRequest;
  const { filter } = data;

  const validFilters: ("all" | "complete" | "incomplete")[] = [
    "all",
    "complete",
    "incomplete",
  ];

  if (!filter || !validFilters.includes(filter)) {
    return new Response(JSON.stringify({ error: "Invalid filter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Change filter
  state.filter = filter;

  return new Response(
    JSON.stringify({
      filter: state.filter,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
