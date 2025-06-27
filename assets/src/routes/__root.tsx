import { useEffect } from 'react'
import {
  Outlet,
  createRootRoute,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Flex } from '@radix-ui/themes'
import { Providers } from '../components/Providers'
import { useAuth } from '../hooks/useAuth'

// The Root component renders the theme and handles redirecting
// on and off the welcome page based on authentication state.
function Root() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  console.log('Root page', 'isAuthenticated', isAuthenticated)

  useEffect(() => {
    console.log(
      'Root.useEffect',
      'isAuthenticated',
      isAuthenticated,
      location.pathname
    )

    if (!isAuthenticated && location.pathname !== '/welcome') {
      console.log('redirect to welcome ...')

      const path = location.pathname
      const hasPath = path !== undefined && path !== '/'
      const search = hasPath ? { next: path } : { next: undefined }

      navigate({ to: '/welcome', replace: true, search })
    }

    if (isAuthenticated && location.pathname === '/welcome') {
      console.log('redirect to index ...')

      navigate({ to: '/', replace: true })
    }
  }, [isAuthenticated, location.pathname, location.search, navigate])

  return (
    <>
      <Providers defaultTheme="dark">
        <Flex height="100vh" width="100vw" overflow="hidden">
          <Outlet />
        </Flex>
      </Providers>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

export const Route = createRootRoute({ component: Root })
