import { createFileRoute } from '@tanstack/react-router'
import ScreenWithHeader from '../components/ScreenWithHeader'
import { Flex, Box } from '@radix-ui/themes'
import ThreadHeading from '../components/ThreadHeading'
import UserTopBar from '../components/UserTopBar'
import ChatArea from '../components/ChatArea'

export const Route = createFileRoute(`/`)({
  component: Index,
})

function Index() {
  // Sample users in the chat with some having images
  const activeUsers = [
    { username: 'alice', imageUrl: 'https://i.pravatar.cc/150?u=alice' },
    { username: 'bob' },
    { username: 'carol', imageUrl: 'https://i.pravatar.cc/150?u=carol' },
    { username: 'dave' },
  ]
  // Sample agents in the chat
  const activeAgents = [
    { username: 'claude', imageUrl: 'https://i.pravatar.cc/150?u=claude' },
    { username: 'gpt4' },
  ]

  return (
    <ScreenWithHeader
      title={<ThreadHeading title="This is a conversation" />}
      disableScroll={true}
    >
      <Flex direction="column" height="100%">
        <Box>
          <UserTopBar users={activeUsers} agents={activeAgents} />
        </Box>
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <ChatArea />
        </Box>
      </Flex>
    </ScreenWithHeader>
  )
}
