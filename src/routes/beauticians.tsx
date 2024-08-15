import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/beauticians')({
  component: () => <div>Hello /beauticians!</div>
})