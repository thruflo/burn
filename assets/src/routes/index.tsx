import { createFileRoute } from '@tanstack/react-router'
import ScreenWithHeader from '../components/ScreenWithHeader'
import { Flex, Box } from '@radix-ui/themes'
import ThreadHeading from '../components/ThreadHeading'
import UserTopBar from '../components/UserTopBar'
import ChatArea from '../components/ChatArea'
import Sidebar from '../components/Sidebar'
import RightSidebar from '../components/RightSidebar'
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
    <Flex height="100vh" width="100vw" overflow="hidden" className="app-layout">
      <Sidebar />
      <Flex direction="column" className="content-area" width="100%">
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
      </Flex>
      <RightSidebar />
    </Flex>
  )
}
