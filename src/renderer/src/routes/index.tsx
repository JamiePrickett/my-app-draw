import { createFileRoute, Link } from '@tanstack/react-router'
import '../css/index.css'

export const Route = createFileRoute('/')({
  component: Home
})

function Home() {
  return (
    <div>
      <Link to="/add-app" />
    </div>
  )
}
