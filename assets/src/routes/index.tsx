import { createFileRoute } from '@tanstack/react-router'
import { Flex, Box, Text } from '@radix-ui/themes'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  const { isLoggedIn } = useAuth()

  // Don't render anything if not authenticated (redirect will handle this)
  if (!isLoggedIn) {
    return null
  }

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
