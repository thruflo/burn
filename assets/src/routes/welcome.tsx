import { createFileRoute } from '@tanstack/react-router'
import WelcomeScreen from '../components/WelcomeScreen'

export const Route = createFileRoute('/welcome')({
  component: Welcome,
  validateSearch: (search: Record<string, unknown>) => ({
    next: (search.next as string) || undefined,
  }),
})

function Welcome() {
  return <WelcomeScreen />
}
