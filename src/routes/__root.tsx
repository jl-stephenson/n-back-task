import { TrialContextProvider } from "@/contexts/TrialContextProvider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: () => {
    return (
      <TrialContextProvider>
        <main className="grid min-h-svh place-content-center">
          <Outlet />
        </main>
        <TanStackRouterDevtools />
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      </TrialContextProvider>
    );
  },
});
