import { TrialContextProvider } from "@/contexts/TrialContextProvider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => {
    return (
      <TrialContextProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </TrialContextProvider>
    );
  },
});
