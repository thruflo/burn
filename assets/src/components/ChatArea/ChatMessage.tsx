import { Box, Flex, Text, Badge } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
//import { useAuth } from '../../db/auth'
import type { MessageResult } from '../../types'
import UserAvatar from '../UserAvatar'

const useStyles = makeStyles({
  message: {
    display: 'flex',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-5)',
    maxWidth: '100%',
  },
  avatar: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  messageText: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
  },
  timestamp: {
    fontSize: '12px',
    opacity: 0.7,
  },
  userBadge: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    display: 'inline',
    verticalAlign: 'middle',
  }
})

function formatTimestamp(timestamp: Date): string {
  const now = new Date()
  const messageTime = new Date(timestamp)

  // Calculate the difference in days
  const timeDiff = now.getTime() - messageTime.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

  if (daysDiff >= 1) {
    // More than 1 day ago - show date and time
    return messageTime.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } else {
    // Same day - show only time
    return messageTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

interface Props {
  event: MessageResult
}

function ChatMessage({ event }: Props) {
  const classes = useStyles()
  //const { currentUserId } = useAuth()

  const isUser = event.role === 'user'
  //const isCurrentUser = isUser && currentUserId && event.user_id === currentUserId
  const userName = (isUser ? event.user_name : event.assistant) as string
  const userBadgeColor = isUser ? 'blue' : 'purple'

  // XXX todo more formatting
  const messageContent = (
    event.type === 'text'
      ? event.data.text
      : JSON.stringify(event.data)
  ) as string

  return (
    <Box className={classes.message}>
      <Box className={classes.avatar}>
        <UserAvatar username={userName} imageUrl={undefined} size="medium" showTooltip={false} />
      </Box>
      <Box className={classes.content}>
        <Flex align="center" gap="2" mb="1">
          <Badge size="2" variant="soft" color={userBadgeColor} className={classes.userBadge}>
            {userName}
          </Badge>
          <Text size="1" className={classes.timestamp}>
            { event.inserted_at ? formatTimestamp(event.inserted_at) : 'now' }
          </Text>
        </Flex>
        <Text size="2" className={classes.messageText}>
          {messageContent}
        </Text>
      </Box>
    </Box>
  )
}

export default ChatMessage