import { Results } from "@/components/Results";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/results")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Results />;
}
