import { Intro } from '@/components/Intro'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/intro')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Intro />
}
