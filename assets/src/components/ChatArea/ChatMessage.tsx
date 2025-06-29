import { Box, Flex, Text, Badge } from '@radix-ui/themes'
import { makeStyles } from '@griffel/react'
//import { useAuth } from '../../db/auth'
import { useRelativeTime } from '../../hooks/useRelativeTime'
import type { MessageResult } from '../../types'
import UserAvatar from '../UserAvatar'

const useStyles = makeStyles({
  message: {
    display: 'flex',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
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
    fontSize: '13px',
  },
  timestamp: {
    fontSize: '10px',
    opacity: 0.7,
  },
  userBadge: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    display: 'inline',
    verticalAlign: 'middle',
    paddingTop: '1.5px',
    paddingBottom: '2px'
  }
})

interface Props {
  event: MessageResult
}

function ChatMessage({ event }: Props) {
  const classes = useStyles()
  const timeStr = useRelativeTime(event.inserted_at)
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
            { userName }
          </Badge>
          <Text size="1" className={classes.timestamp}>
            { timeStr }
          </Text>
        </Flex>
        <Text size="2" className={classes.messageText}>
          { messageContent }
        </Text>
      </Box>
    </Box>
  )
}

export default ChatMessage