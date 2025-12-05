import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/routeTwo')({
  component: AddApp
})

function AddApp() {
  return (
    <div>
      <Link to="/">Home</Link>
    </div>
  )
}
