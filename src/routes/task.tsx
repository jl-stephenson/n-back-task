import { Task } from '@/components/Task'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/task')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Task />
}
