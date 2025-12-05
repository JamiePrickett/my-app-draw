import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/add-app')({
  component: AddApp
})

function AddApp() {
  return (
    <div>
      <Link to="/">Home</Link>
    </div>
  )
}
