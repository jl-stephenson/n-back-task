import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/Landing";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Landing />;
}
