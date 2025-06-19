import { Box, Flex, Text, Badge } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
import UserAvatar from './UserAvatar'

// Helper function to format timestamp with proper localization
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

const useStyles = makeStyles({
  message: {
    display: 'flex',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-5)',
    maxWidth: '100%',
  },
  userMessage: {},
  aiMessage: {},
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
})

export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  username?: string
  avatarUrl?: string
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const classes = useStyles()
  const isUser = message.sender === 'user'

  return (
    <Box
      className={`${classes.message} ${
        isUser ? classes.userMessage : classes.aiMessage
      }`}
    >
      <Box className={classes.avatar}>
        <UserAvatar
          username={message.username || (isUser ? 'You' : 'Assistant')}
          imageUrl={message.avatarUrl}
          size="medium"
          showTooltip={false}
        />
      </Box>
      <Box className={classes.content}>
        <Flex align="center" gap="2" mb="1">
          <Badge
            size="2"
            variant="soft"
            color={isUser ? 'blue' : 'purple'}
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              display: 'inline',
              verticalAlign: 'middle',
            }}
          >
            {message.username || (isUser ? 'You' : 'Assistant')}
          </Badge>
          <Text size="1" className={classes.timestamp}>
            {formatTimestamp(message.timestamp)}
          </Text>
        </Flex>
        <Text size="2" className={classes.messageText}>
          {message.content}
        </Text>
      </Box>
    </Box>
  )
}
