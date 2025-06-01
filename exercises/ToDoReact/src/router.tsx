import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import App from "./App";
import TabPage from "./pages/TabPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Home route (redirects to default tab)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <App redirectTo="/tab/today" />,
});

// Tab route with dynamic tabId parameter
const tabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tab/$tabId",
  component: TabPage,
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

// 404 route
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  tabRoute,
  settingsRoute,
  notFoundRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
