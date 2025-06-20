import {
  createRootRoute,
  Outlet,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { Flex } from '@radix-ui/themes'
import { Providers } from '../components/Providers'
import { useAuth } from '../hooks/useAuth'

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect to welcome with next parameter if not logged in
  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/welcome') {
      // Check if we're at root path with no search params
      if (
        location.pathname === '/' &&
        (!location.search || Object.keys(location.search).length === 0)
      ) {
        // Redirect to welcome without next parameter for clean URL
        navigate({
          to: '/welcome',
          replace: true,
        })
      } else {
        // Build full path with search parameters for non-root paths
        const searchString =
          typeof location.search === 'string'
            ? location.search
            : location.search
              ? `?${new URLSearchParams(location.search as any).toString()}`
              : ''
        const nextPath = location.pathname + searchString

        navigate({
          to: '/welcome',
          search: { next: nextPath },
          replace: true,
        })
      }
    }

    // Redirect away from welcome if already logged in
    if (isLoggedIn && location.pathname === '/welcome') {
      navigate({ to: '/', replace: true })
    }
  }, [isLoggedIn, location.pathname, location.search, navigate])

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
