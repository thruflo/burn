import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Flex, Box, Text } from '@radix-ui/themes'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // Don't render anything if not authenticated (redirect will handle this)
  if (!isLoggedIn) {
    return null
  }

  // Always redirect to most recent thread (backend ensures thread exists)
  useEffect(() => {
    // TODO: Replace with actual data fetch
    const latestThreadId = 'latest-thread-123' // or null if race condition

    if (latestThreadId) {
      navigate({
        to: '/threads/$threadId',
        params: { threadId: latestThreadId },
      })
    }
    // If null, component returns null (handles race conditions)
  }, [navigate])

  return (
    <Flex
      height="100vh"
      width="100vw"
      align="center"
      justify="center"
      direction="column"
    >
      <Box>
        <Text size="4" color="gray">
          Home page placeholder
        </Text>
      </Box>
    </Flex>
  )
}
