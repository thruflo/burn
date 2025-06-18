import { createFileRoute } from '@tanstack/react-router'
import ScreenWithHeader from '../components/ScreenWithHeader'
import { Flex, Box } from '@radix-ui/themes'
import ThreadHeading from '../components/ThreadHeading'
import UserTopBar from '../components/UserTopBar'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  // Sample users in the chat
  const activeUsers = ['alice', 'bob', 'carol', 'dave']
  // Sample agents in the chat
  const activeAgents = ['claude', 'gpt4']

  return (
    <ScreenWithHeader title={<ThreadHeading title="This is a conversation" />}>
      <Flex direction="column">
        <Box>
          <UserTopBar users={activeUsers} agents={activeAgents} />
        </Box>
        {/* Main content area */}
      </Flex>
    </ScreenWithHeader>
  )
}
