import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Flex, Box } from '@radix-ui/themes'

import ScreenWithHeader from '../../components/ScreenWithHeader'
import Sidebar from '../../components/Sidebar'
import RightSidebar from '../../components/RightSidebar'

import ThreadHeading from '../../components/ThreadHeading'
import UserTopBar from '../../components/UserTopBar'
import ThreadEditTopBar from '../../components/ThreadEditTopBar'
import ThreadEditForm from '../../components/ThreadEditForm'
import ChatArea from '../../components/ChatArea'

import { useAuth } from '../../hooks/useAuth'

function ThreadPage() {
  const { isAuthenticated } = useAuth()
  const { threadId } = useParams({ from: '/threads/$threadId' })

  const [ isEditing, setIsEditing ] = useState(false)

  // Don't render anything if not authenticated (redirect will handle this)
  if (!isAuthenticated) {
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
      <Sidebar activeThreadId={threadId} />
      <Flex direction="column" className="content-area" width="100%">
        <ScreenWithHeader
            title={<ThreadHeading title="This is a conversation" />}
            disableScroll={true}>
          <Flex direction="column" height="100%">
            {isEditing ? (
              <>
                <Box>
                  <ThreadEditTopBar onClose={() => setIsEditing(false)} />
                </Box>
                <Box style={{ flex: 1, overflow: 'hidden' }}>
                  <ThreadEditForm threadId={threadId} />
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <UserTopBar
                      users={activeUsers}
                      agents={activeAgents}
                      threadId={threadId}
                      onEditClick={() => setIsEditing(true)}
                  />
                </Box>
                <Box style={{ flex: 1, overflow: 'hidden' }}>
                  <ChatArea />
                </Box>
              </>
            )}
          </Flex>
        </ScreenWithHeader>
      </Flex>
      <RightSidebar />
    </Flex>
  )
}

export const Route = createFileRoute(`/threads/$threadId`)({
  component: ThreadPage,
})
